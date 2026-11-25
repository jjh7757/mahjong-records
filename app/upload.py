"""업로드 본문 검사와 저장.

본문: {"game": Game.toJson(), "settlement": [{"seat","name","rank","points","score","stars"} ×4],
       "paifu": [Paifu.toJson() ...], "app_version": "..."}
정산은 앱이 계산해 보낸다(Game.settle()). 서버는 가볍게만 본다(설계 3절): 자리 4개 · 순위 1~4 한 번씩 · 이름 비어 있지 않음
+ 저장에 쓰는 칸의 꼴.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime
from decimal import ROUND_HALF_UP, Decimal
from typing import Any
from zoneinfo import ZoneInfo

from psycopg.types.json import Jsonb

MANUAL_ENDED_BY = "직접 입력"  # 앱 Game.manualEndedBy
MAX_NAME = 100
MAX_ID = 200
MAX_EVENTS = 5000
MAX_PAIFU = 100


class BadPayload(ValueError):
    pass


def _is_int(v: Any) -> bool:
    return isinstance(v, int) and not isinstance(v, bool)


def _is_num(v: Any) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def _int_list(v: Any, n: int | None = None) -> bool:
    return isinstance(v, list) and (n is None or len(v) == n) and all(_is_int(x) for x in v)


@dataclass
class Parsed:
    game: dict
    settlement: list[dict]
    paifu: list[dict]
    app_version: str | None
    started_at: datetime
    sha256: str


def canonical_sha256(body: dict) -> str:
    s = json.dumps(body, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def parse_started_at(s: Any, tz: str) -> datetime:
    if not isinstance(s, str) or not s:
        raise BadPayload("game.startedAt 이 없습니다")
    try:
        dt = datetime.fromisoformat(s)
    except ValueError as e:
        raise BadPayload(f"game.startedAt 형식이 틀립니다: {s!r}") from e
    if dt.tzinfo is None:  # Dart 지역 시각(toIso8601String) — 시간대 없음
        dt = dt.replace(tzinfo=ZoneInfo(tz))
    return dt


def validate(body: Any, tz: str) -> Parsed:
    if not isinstance(body, dict):
        raise BadPayload("본문은 JSON 객체여야 합니다")
    game = body.get("game")
    if not isinstance(game, dict):
        raise BadPayload("game 이 없습니다")
    gid = game.get("id")
    if not isinstance(gid, str) or not gid.strip() or len(gid) > MAX_ID:
        raise BadPayload("game.id 가 비었거나 너무 깁니다")
    started = parse_started_at(game.get("startedAt"), tz)
    names = game.get("names")
    if not (isinstance(names, list) and len(names) == 4 and all(isinstance(n, str) for n in names)):
        raise BadPayload("game.names 는 문자열 4개여야 합니다")
    if not _int_list(game.get("scores"), 4):
        raise BadPayload("game.scores 는 정수 4개여야 합니다")
    settings = game.get("settings")
    if not isinstance(settings, dict):
        raise BadPayload("game.settings 가 없습니다")
    if "finished" in game and not isinstance(game["finished"], bool):
        raise BadPayload("game.finished 는 참/거짓이어야 합니다")
    if game.get("endedBy") is not None and not isinstance(game["endedBy"], str):
        raise BadPayload("game.endedBy 는 문자열이어야 합니다")
    events = game.get("events")
    if not isinstance(events, list) or len(events) > MAX_EVENTS:
        raise BadPayload("game.events 는 목록이어야 합니다")
    for i, e in enumerate(events):
        if not (
            isinstance(e, dict)
            and isinstance(e.get("kind"), str)
            and isinstance(e.get("description"), str)
            and isinstance(e.get("round"), str)
            and _int_list(e.get("delta"), 4)
            and (e.get("stars") is None or _int_list(e.get("stars"), 4))
        ):
            raise BadPayload(f"game.events[{i}] 꼴이 틀립니다(kind · description · round · delta[4] · stars[4]?)")

    st = body.get("settlement")
    if not isinstance(st, list) or len(st) != 4:
        raise BadPayload("settlement 는 4개여야 합니다")
    for i, r in enumerate(st):
        if not isinstance(r, dict):
            raise BadPayload(f"settlement[{i}] 가 객체가 아닙니다")
        if not (_is_int(r.get("seat")) and _is_int(r.get("rank")) and _is_int(r.get("points")) and _is_num(r.get("score"))):
            raise BadPayload(f"settlement[{i}] 의 seat · rank · points · score 꼴이 틀립니다")
        if r.get("stars") is not None and not (_is_int(r["stars"]) and r["stars"] >= 0):
            raise BadPayload(f"settlement[{i}].stars 는 0 이상 정수여야 합니다")
        name = r.get("name")
        if not isinstance(name, str) or not name.strip():
            raise BadPayload(f"settlement[{i}].name 이 비었습니다")
        if len(name) > MAX_NAME:
            raise BadPayload(f"settlement[{i}].name 이 너무 깁니다")
        if abs(r["score"]) >= 100000:
            raise BadPayload(f"settlement[{i}].score 가 너무 큽니다")
    if sorted(r["seat"] for r in st) != [0, 1, 2, 3]:
        raise BadPayload("settlement 의 자리는 0~3 을 한 번씩이어야 합니다")
    if sorted(r["rank"] for r in st) != [1, 2, 3, 4]:
        raise BadPayload("settlement 의 순위는 1~4 를 한 번씩이어야 합니다")

    paifu = body.get("paifu", [])
    if paifu is None:
        paifu = []
    if not isinstance(paifu, list) or len(paifu) > MAX_PAIFU:
        raise BadPayload("paifu 는 목록이어야 합니다")
    for i, p in enumerate(paifu):
        if not isinstance(p, dict):
            raise BadPayload(f"paifu[{i}] 가 객체가 아닙니다")
        if p.get("version", 1) != 1:
            raise BadPayload(f"paifu[{i}] 모르는 버전: {p.get('version')!r}")
        hero = p.get("hero")
        if not (_is_int(hero) and 0 <= hero <= 3):
            raise BadPayload(f"paifu[{i}].hero 는 0~3 이어야 합니다")
        if not isinstance(p.get("events", []), list):
            raise BadPayload(f"paifu[{i}].events 는 목록이어야 합니다")
        for k in ("honba", "dealer"):
            if p.get(k) is not None and not _is_int(p[k]):
                raise BadPayload(f"paifu[{i}].{k} 는 정수여야 합니다")
        res = p.get("result")
        if res is not None and not isinstance(res, dict):
            raise BadPayload(f"paifu[{i}].result 는 객체여야 합니다")

    ver = body.get("app_version")
    if ver is not None and (not isinstance(ver, str) or len(ver) > 100):
        raise BadPayload("app_version 은 100자 이하 문자열이어야 합니다")
    return Parsed(game, st, paifu, ver, started, canonical_sha256(body))


def _score(v: float | int) -> Decimal:
    return Decimal(str(v)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)


def _opt_int(v: Any) -> int | None:
    return v if _is_int(v) else None


def save(conn, store_id: int, p: Parsed) -> tuple[str, int]:
    """(store, game.id) 로 멱등 upsert. ("created" | "updated" | "unchanged", game 행 id)."""
    g = p.game
    gid = g["id"]
    settings = g["settings"]
    cols = dict(
        started_at=p.started_at,
        finished=bool(g.get("finished", False)),
        ended_by=g.get("endedBy"),
        manual=g.get("endedBy") == MANUAL_ENDED_BY,
        east_only=bool(settings.get("eastOnly", False)),
        settings=Jsonb(settings),
        raw=Jsonb(g),
        payload_sha256=p.sha256,
        app_version=p.app_version,
    )
    with conn.transaction():
        row = conn.execute(
            "SELECT id, payload_sha256 FROM app.game WHERE store_id = %s AND client_game_id = %s FOR UPDATE",
            (store_id, gid),
        ).fetchone()
        if row is None:
            row = conn.execute(
                """INSERT INTO app.game (store_id, client_game_id, started_at, finished, ended_by, manual, east_only,
                                         settings, raw, payload_sha256, app_version)
                   VALUES (%(store_id)s, %(gid)s, %(started_at)s, %(finished)s, %(ended_by)s, %(manual)s, %(east_only)s,
                           %(settings)s, %(raw)s, %(payload_sha256)s, %(app_version)s)
                   ON CONFLICT (store_id, client_game_id) DO NOTHING
                   RETURNING id""",
                dict(cols, store_id=store_id, gid=gid),
            ).fetchone()
            if row is None:  # 같은 대국이 동시에 들어왔다 — 먼저 넣은 쪽을 두고 다시 비교
                row = conn.execute(
                    "SELECT id, payload_sha256 FROM app.game WHERE store_id = %s AND client_game_id = %s FOR UPDATE",
                    (store_id, gid),
                ).fetchone()
                if row[1] == p.sha256:
                    return "unchanged", row[0]
                status, game_row = "updated", row[0]
            else:
                status, game_row = "created", row[0]
        elif row[1] == p.sha256:
            return "unchanged", row[0]
        else:
            status, game_row = "updated", row[0]

        if status == "updated":
            conn.execute(
                """UPDATE app.game SET started_at = %(started_at)s, finished = %(finished)s, ended_by = %(ended_by)s,
                          manual = %(manual)s, east_only = %(east_only)s, settings = %(settings)s, raw = %(raw)s,
                          payload_sha256 = %(payload_sha256)s, app_version = %(app_version)s, updated_at = now()
                   WHERE id = %(id)s""",
                dict(cols, id=game_row),
            )
            for t in ("game_player", "game_event", "paifu_round"):
                conn.execute(f"DELETE FROM app.{t} WHERE game_id = %s", (game_row,))  # 표 이름은 고정 목록

        with conn.cursor() as cur:
            cur.executemany(
                """INSERT INTO app.game_player (game_id, seat, name, final_points, rank, score, stars, bust)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                [
                    (game_row, r["seat"], r["name"], r["points"], r["rank"], _score(r["score"]), r.get("stars") or 0, r["points"] < 0)
                    for r in p.settlement
                ],
            )
            if g["events"]:
                cur.executemany(
                    """INSERT INTO app.game_event (game_id, seq, kind, round_label, description, delta, stars)
                       VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                    [
                        (game_row, i, e["kind"], e["round"], e["description"], e["delta"], e.get("stars"))
                        for i, e in enumerate(g["events"])
                    ],
                )
            if p.paifu:
                rows = []
                for i, pf in enumerate(p.paifu):
                    res = pf.get("result") or {}
                    rows.append((
                        game_row, i, str(pf.get("id") or ""), str(pf.get("round") or ""),
                        _opt_int(pf.get("honba")) or 0, _opt_int(pf.get("dealer")) or 0, pf["hero"],
                        res.get("type") if isinstance(res.get("type"), str) else None,
                        _opt_int(res.get("winner")), _opt_int(res.get("loser")), Jsonb(pf),
                    ))
                cur.executemany(
                    """INSERT INTO app.paifu_round (game_id, seq, paifu_id, round_name, honba, dealer, hero,
                                                    result_type, winner, loser, raw)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    rows,
                )
    return status, game_row
