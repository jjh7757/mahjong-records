"""공개 조회 API(로그인 없음)와 매장 키 업로드."""
from __future__ import annotations

import json
from datetime import date, datetime, time, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.concurrency import run_in_threadpool

from . import upload
from .security import store_key_hash
from .stats import member_stats

router = APIRouter(prefix="/api/v1")

PAGE_SIZE = 20
RECENT_GAMES = 50
RANK_FLOW = 20
# 공개 응답에서 빼는 패보 칸: 태블릿 파일 경로(frames) · 복원 메모(restore). 재생에 필요 없다. DB 의 raw 는 그대로.
PAIFU_PRIVATE_KEYS = ("frames", "restore")


def _pool(request: Request):
    return request.app.state.pool


def _tz(request: Request) -> ZoneInfo:
    return ZoneInfo(request.app.state.settings.timezone)


def _period(request: Request, from_: str | None, to: str | None) -> tuple[datetime | None, datetime | None]:
    """?from=YYYY-MM-DD&to=YYYY-MM-DD (둘 다 포함, 설정 시간대의 날짜)."""
    tz = _tz(request)

    def day(s: str | None, name: str) -> date | None:
        if not s:
            return None
        try:
            return date.fromisoformat(s)
        except ValueError:
            raise HTTPException(422, f"{name} 는 YYYY-MM-DD 여야 합니다") from None

    f, t = day(from_, "from"), day(to, "to")
    lo = datetime.combine(f, time.min, tz) if f else None
    hi = datetime.combine(t + timedelta(days=1), time.min, tz) if t else None
    return lo, hi


_PERIOD_SQL = "(%(lo)s::timestamptz IS NULL OR g.started_at >= %(lo)s) AND (%(hi)s::timestamptz IS NULL OR g.started_at < %(hi)s)"


# ---------- 업로드 ----------


def _store_for_key(conn, key: str | None) -> int:
    if not key:
        raise HTTPException(401, "매장 키가 없습니다")
    row = conn.execute(
        "SELECT id FROM app.store WHERE key_hash = %s AND revoked_at IS NULL", (store_key_hash(key),)
    ).fetchone()
    if row is None:
        raise HTTPException(401, "매장 키가 틀렸거나 폐기되었습니다")
    return row[0]


@router.post("/games")
async def upload_game(request: Request):
    key = request.headers.get("x-store-key")
    raw = await request.body()
    tz = request.app.state.settings.timezone

    def work():
        with _pool(request).connection() as conn:
            store_id = _store_for_key(conn, key)  # 키부터 본다(키 없는 요청에 본문 검사 결과를 알려 주지 않음)
            try:
                body = json.loads(raw)
            except (ValueError, UnicodeDecodeError):
                raise HTTPException(400, "본문이 JSON 이 아닙니다") from None
            try:
                parsed = upload.validate(body, tz)
            except upload.BadPayload as e:
                raise HTTPException(422, str(e)) from None
            return upload.save(conn, store_id, parsed)

    status, game_id = await run_in_threadpool(work)
    return {"status": status, "id": game_id}


# ---------- 멤버 ----------


def _player_rows(conn, lo, hi, name: str | None = None):
    sql = (
        "SELECT p.name, p.rank, p.final_points, p.score, p.stars FROM app.game_player p "
        "JOIN app.game g ON g.id = p.game_id WHERE NOT g.hidden AND " + _PERIOD_SQL
    )
    params: dict[str, Any] = {"lo": lo, "hi": hi}
    if name is not None:
        sql += " AND p.name = %(name)s"
        params["name"] = name
    sql += " ORDER BY g.started_at, g.id, p.seat"
    return conn.execute(sql, params).fetchall()


@router.get("/members")
def members(request: Request, from_: str | None = Query(None, alias="from"), to: str | None = None):
    lo, hi = _period(request, from_, to)
    with _pool(request).connection() as conn:
        rows = _player_rows(conn, lo, hi)
    return {"from": from_, "to": to, "members": [m.to_json() for m in member_stats(rows)]}


def _players_of(conn, game_ids: list[int]) -> dict[int, list[dict]]:
    out: dict[int, list[dict]] = {gid: [] for gid in game_ids}
    if not game_ids:
        return out
    for gid, seat, name, pts, rank, score, stars, bust in conn.execute(
        "SELECT game_id, seat, name, final_points, rank, score, stars, bust FROM app.game_player "
        "WHERE game_id = ANY(%s) ORDER BY game_id, seat",
        (game_ids,),
    ).fetchall():
        out[gid].append(
            {"seat": seat, "name": name, "final_points": pts, "rank": rank, "score": float(score), "stars": stars, "bust": bust}
        )
    return out


def _game_summaries(conn, rows) -> list[dict]:
    ids = [r[0] for r in rows]
    players = _players_of(conn, ids)
    return [
        {
            "id": gid,
            "started_at": started.isoformat(),
            "ended_by": ended_by,
            "manual": manual,
            "east_only": east_only,
            "finished": finished,
            "paifu_count": paifu_count,
            "source": source,
            "players": players[gid],
        }
        for gid, started, ended_by, manual, east_only, finished, paifu_count, source in rows
    ]


_SUMMARY_COLS = (
    "g.id, g.started_at, g.ended_by, g.manual, g.east_only, g.finished, "
    "(SELECT count(*) FROM app.paifu_round r WHERE r.game_id = g.id)::int, "
    "g.settings->>'source'"  # 다른 사이트에서 가져온 대국이면 'mavely' 등, 앱이 올린 대국은 null
)


@router.get("/members/{name}")
def member_detail(request: Request, name: str, from_: str | None = Query(None, alias="from"), to: str | None = None):
    lo, hi = _period(request, from_, to)
    with _pool(request).connection() as conn:
        rows = _player_rows(conn, lo, hi, name)
        if not rows:
            raise HTTPException(404, "이 이름의 대국이 없습니다")
        stat = member_stats(rows)[0]
        params = {"lo": lo, "hi": hi, "name": name}
        games = conn.execute(
            f"SELECT {_SUMMARY_COLS} FROM app.game g WHERE NOT g.hidden AND {_PERIOD_SQL} "
            "AND EXISTS (SELECT 1 FROM app.game_player p WHERE p.game_id = g.id AND p.name = %(name)s) "
            f"ORDER BY g.started_at DESC, g.id DESC LIMIT {RECENT_GAMES}",
            params,
        ).fetchall()
        flow = conn.execute(
            "SELECT g.id, g.started_at, p.rank, p.score, p.final_points FROM app.game g "
            "JOIN app.game_player p ON p.game_id = g.id AND p.name = %(name)s "
            f"WHERE NOT g.hidden AND {_PERIOD_SQL} ORDER BY g.started_at DESC, g.id DESC, p.seat LIMIT {RANK_FLOW}",
            params,
        ).fetchall()
        summaries = _game_summaries(conn, games)
    return {
        "member": stat.to_json(),
        "games": summaries,
        "rank_flow": [
            {"game_id": gid, "started_at": st.isoformat(), "rank": rank, "score": float(score), "final_points": pts}
            for gid, st, rank, score, pts in reversed(flow)
        ],
    }


# ---------- 대국 ----------


@router.get("/games")
def games(request: Request, member: str | None = None, page: int = Query(1, ge=1, le=100000)):
    params: dict[str, Any] = {"member": member, "limit": PAGE_SIZE, "offset": (page - 1) * PAGE_SIZE}
    where = "NOT g.hidden"
    if member:
        where += " AND EXISTS (SELECT 1 FROM app.game_player p WHERE p.game_id = g.id AND p.name = %(member)s)"
    with _pool(request).connection() as conn:
        total = conn.execute(f"SELECT count(*) FROM app.game g WHERE {where}", params).fetchone()[0]
        rows = conn.execute(
            f"SELECT {_SUMMARY_COLS} FROM app.game g WHERE {where} "
            "ORDER BY g.started_at DESC, g.id DESC LIMIT %(limit)s OFFSET %(offset)s",
            params,
        ).fetchall()
        items = _game_summaries(conn, rows)
    return {"page": page, "page_size": PAGE_SIZE, "total": total, "items": items}


def public_paifu(raw: dict) -> dict:
    return {k: v for k, v in raw.items() if k not in PAIFU_PRIVATE_KEYS}


@router.get("/games/{game_id}")
def game_detail(request: Request, game_id: int):
    with _pool(request).connection() as conn:
        g = conn.execute(
            "SELECT g.id, g.started_at, g.finished, g.ended_by, g.manual, g.east_only, g.settings, g.uploaded_at, "
            "g.updated_at, g.app_version, s.name, g.settings->>'source' FROM app.game g JOIN app.store s ON s.id = g.store_id "
            "WHERE g.id = %s AND NOT g.hidden",
            (game_id,),
        ).fetchone()
        if g is None:
            raise HTTPException(404, "대국이 없습니다")
        players = _players_of(conn, [game_id])[game_id]
        events = conn.execute(
            "SELECT seq, kind, round_label, description, delta, stars FROM app.game_event WHERE game_id = %s ORDER BY seq",
            (game_id,),
        ).fetchall()
        paifu = conn.execute(
            "SELECT seq, paifu_id, round_name, honba, dealer, hero, result_type, winner, loser, raw "
            "FROM app.paifu_round WHERE game_id = %s ORDER BY seq",
            (game_id,),
        ).fetchall()
    gid, started, finished, ended_by, manual, east_only, settings, uploaded, updated, app_version, store, source = g
    return {
        "id": gid,
        "started_at": started.isoformat(),
        "finished": finished,
        "ended_by": ended_by,
        "manual": manual,
        "east_only": east_only,
        "settings": settings,
        "store": store,
        "source": source,
        "uploaded_at": uploaded.isoformat(),
        "updated_at": updated.isoformat(),
        "app_version": app_version,
        "players": players,
        "events": [
            {"seq": s, "kind": k, "round": r, "description": d, "delta": list(delta), "stars": list(st) if st is not None else None}
            for s, k, r, d, delta, st in events
        ],
        "paifu": [
            {
                "seq": s, "paifu_id": pid, "round": rn, "honba": hb, "dealer": dl, "hero": hero,
                "result_type": rt, "winner": w, "loser": lo, "raw": public_paifu(raw),
            }
            for s, pid, rn, hb, dl, hero, rt, w, lo, raw in paifu
        ],
    }


@router.get("/overview")
def overview(request: Request):
    tz = request.app.state.settings.timezone
    with _pool(request).connection() as conn:
        total, members_n, first, last = conn.execute(
            "SELECT count(*), (SELECT count(DISTINCT p.name) FROM app.game_player p JOIN app.game g2 ON g2.id = p.game_id "
            "WHERE NOT g2.hidden), min(started_at), max(started_at) FROM app.game g WHERE NOT g.hidden"
        ).fetchone()
        monthly = conn.execute(
            "SELECT to_char(g.started_at AT TIME ZONE %s, 'YYYY-MM') AS m, count(*) FROM app.game g "
            "WHERE NOT g.hidden GROUP BY m ORDER BY m",
            (tz,),
        ).fetchall()
        kinds = dict(
            conn.execute(
                "SELECT e.kind, count(*) FROM app.game_event e JOIN app.game g ON g.id = e.game_id "
                "WHERE NOT g.hidden AND NOT g.manual AND e.kind IN ('win', 'draw') GROUP BY e.kind"
            ).fetchall()
        )
        paifu_n = conn.execute(
            "SELECT count(*) FROM app.paifu_round r JOIN app.game g ON g.id = r.game_id WHERE NOT g.hidden"
        ).fetchone()[0]
    wins, draws = kinds.get("win", 0), kinds.get("draw", 0)
    hands = wins + draws
    return {
        "games": total,
        "members": members_n,
        "paifu_rounds": paifu_n,
        "first_game_at": first.isoformat() if first else None,
        "last_game_at": last.isoformat() if last else None,
        "monthly": [{"month": m, "games": n} for m, n in monthly],
        "hands": {
            "total": hands,
            "win": wins,
            "draw": draws,
            "win_rate": round(wins / hands, 4) if hands else None,
            "draw_rate": round(draws / hands, 4) if hands else None,
        },
    }
