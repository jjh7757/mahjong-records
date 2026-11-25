"""마블리(다른 기록 사이트)에서 받아 둔 대국을 이 사이트 DB 에 넣는 SQL 을 만든다. DB 에는 붙지 않는다(표준 라이브러리만).

    python scripts/import_mavely.py ../mahjong_calc/experiments/mavely/results/mavely_games.json
    # → out/import_mavely.sql
    psql -U mahjong -d mahjong -v ON_ERROR_STOP=1 -f out/import_mavely.sql

입력: {"fetched_at", "seasons", "games": [한 판, ...]} — 한 판은 마블리 API(new_games) 의 결과 그대로 + "_season".
자리 1~4 = 동남서북(기동). 값의 뜻(1,600판으로 확인):
  - rate_i = 최종 점수 − 25000. 네 자리 합 = −deposit(끝까지 주인 없이 남은 공탁).
  - uma_i = rate_i/1000 을 0 쪽으로 버린 값 + 순위 우마 20/10/−10/−20(반환 25000, 오카 없음) — 마블리 정산값.
  - ranking_i = 순위 1~4(동점은 기동 자리 순), star_i = 별.

넣는 것(마이그레이션 추가 없이):
  - app.store: key_hash 'import-only:mavely'(sha256 hex 가 아니라 실제 키 해시와 겹칠 수 없음) · 이름 '마블리 가져옴' ·
    revoked_at = now() 로 업로드에 못 쓰게. 이미 있으면 그대로.
  - app.game: client_game_id 'mavely-<id>', manual · finished 참, ended_by '마블리 가져옴', raw = 원본 한 판.
    (store, client_game_id) 가 이미 있으면 아무것도 안 함 — 여러 번 부어도 같은 결과(원본이 바뀌어도 고치지 않음).
  - app.game_player: 이번에 새로 들어간 game 에만(INSERT ... RETURNING 한 id).
  - 전체가 한 트랜잭션.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime
from pathlib import Path

STORE_NAME = "마블리 가져옴"
STORE_KEY_HASH = "import-only:mavely"  # 실제 키 해시는 sha256 hex 64자라 절대 같을 수 없다
ENDED_BY = "마블리 가져옴"
APP_VERSION = "import-mavely"
ID_PREFIX = "mavely-"
START_POINTS = 25000
UMA = {1: 20, 2: 10, 3: -10, 4: -20}  # 마블리 순위 우마(반환 = 시작 25000)
MAX_NAME = 100  # app/upload.py 와 같음
SEATS = (1, 2, 3, 4)
DEFAULT_OUT = Path(__file__).resolve().parent.parent / "out" / "import_mavely.sql"


def _is_int(v) -> bool:
    return isinstance(v, int) and not isinstance(v, bool)


def _has_nul(v) -> bool:
    """Postgres text · jsonb 는 U+0000 을 못 담는다."""
    if isinstance(v, str):
        return "\x00" in v
    if isinstance(v, dict):
        return any(_has_nul(k) or _has_nul(x) for k, x in v.items())
    if isinstance(v, list):
        return any(_has_nul(x) for x in v)
    return False


def canonical_sha256(obj) -> str:
    """app/upload.py canonical_sha256 과 같은 꼴(키 정렬 · 공백 없음 · UTF-8)."""
    s = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def trunc_thousands(rate: int) -> int:
    """rate/1000 을 0 쪽으로 버림(정수 연산)."""
    return -((-rate) // 1000) if rate < 0 else rate // 1000


def check_game(g) -> str | None:
    """규칙에 안 맞으면 사유(문자열), 맞으면 None."""
    if not isinstance(g, dict):
        return "한 판이 객체가 아님"
    if not (_is_int(g.get("id")) and g["id"] > 0):
        return "id 가 양의 정수가 아님"
    try:
        datetime.strptime(g.get("date") or "", "%Y-%m-%d %H:%M")
    except (TypeError, ValueError):
        return "date 가 'YYYY-MM-DD HH:MM' 꼴이 아님"
    for i in SEATS:
        for k in ("rate", "uma", "ranking", "star"):
            if not _is_int(g.get(f"{k}_{i}")):
                return f"{k}_{i} 가 정수가 아님"
    names = [g.get(f"name_{i}") for i in SEATS]
    if not all(isinstance(n, str) and n.strip() for n in names):
        return "이름이 빈 자리"
    if any(len(n.strip()) > MAX_NAME for n in names):
        return "이름이 너무 김"
    if len({n.strip() for n in names}) != 4:
        return "같은 판에 같은 이름"
    ranks = [g[f"ranking_{i}"] for i in SEATS]
    if sorted(ranks) != [1, 2, 3, 4]:
        return "순위가 1~4 를 한 번씩이 아님"
    rates = [g[f"rate_{i}"] for i in SEATS]
    deposit = g.get("deposit", 0)
    if not (_is_int(deposit) and deposit >= 0):
        return "deposit 이 0 이상 정수가 아님"
    if sum(rates) != -deposit:
        return "rate 합이 −deposit 이 아님"
    for a in range(4):
        for b in range(4):
            if rates[a] > rates[b] and ranks[a] > ranks[b]:
                return "점수가 높은데 순위가 낮음"
    if any(g[f"star_{i}"] < 0 for i in SEATS):
        return "별이 음수"
    if any(abs(g[f"uma_{i}"]) >= 100000 for i in SEATS):
        return "uma 가 너무 큼"
    if any(abs(r + START_POINTS) >= 2**31 for r in rates):
        return "점수가 너무 큼"
    if _has_nul(g):
        return "글자 U+0000 이 있음"
    return None


def uma_matches(g) -> bool:
    """uma_i == trunc(rate_i/1000) + 순위 우마 인지(마블리 규칙대로 정산된 판인지)."""
    return all(g[f"uma_{i}"] == trunc_thousands(g[f"rate_{i}"]) + UMA[g[f"ranking_{i}"]] for i in SEATS)


def game_settings(g) -> dict:
    s = {"source": "mavely", "eastOnly": False}
    if isinstance(g.get("_season"), str):
        s["season"] = g["_season"]
    if uma_matches(g):  # 데이터로 확인된 규칙일 때만 적는다(대국 상세의 "시작 · 반환 · 우마" 표시)
        s.update(startPoints=START_POINTS, returnPoints=START_POINTS, umaBig=20, umaSmall=10)
    return s


def players(g) -> list[tuple]:
    """(seat 0~3, name, final_points, rank, score, stars)"""
    out = []
    for i in SEATS:
        pts = g[f"rate_{i}"] + START_POINTS
        out.append((i - 1, g[f"name_{i}"].strip(), pts, g[f"ranking_{i}"], g[f"uma_{i}"], g[f"star_{i}"]))
    return out


def select_games(games: list) -> tuple[list[dict], list[tuple[object, str]]]:
    ok, skipped, seen = [], [], set()
    for g in games:
        why = check_game(g)
        if why is None and g["id"] in seen:
            why = "id 가 입력 안에서 겹침"
        if why is not None:
            skipped.append((g.get("id") if isinstance(g, dict) else None, why))
            continue
        seen.add(g["id"])
        ok.append(g)
    ok.sort(key=lambda g: g["id"])  # 마블리 순서대로 넣어 같은 시각 대국의 목록 순서(id)를 맞춘다
    return ok, skipped


def lit(s: str) -> str:
    """SQL 문자열 상수(standard_conforming_strings = on 에서 ' 만 두 번)."""
    return "'" + s.replace("'", "''") + "'"


def jlit(obj) -> str:
    return lit(json.dumps(obj, ensure_ascii=False, separators=(",", ":"))) + "::jsonb"


def batch_sql(batch: list[dict]) -> str:
    game_rows, player_rows = [], []
    for g in batch:
        cid = ID_PREFIX + str(g["id"])
        game_rows.append(
            f"({lit(cid)}, {lit(g['date'])}, {jlit(game_settings(g))}, {jlit(g)}, {lit(canonical_sha256(g))})"
        )
        for seat, name, pts, rank, score, stars in players(g):
            player_rows.append(f"({lit(cid)}, {seat}, {lit(name)}, {pts}, {rank}, {score}, {stars})")
    return (
        "WITH src (cid, local_ts, settings, raw, sha) AS (VALUES\n  "
        + ",\n  ".join(game_rows)
        + "\n),\npl (cid, seat, name, final_points, rank, score, stars) AS (VALUES\n  "
        + ",\n  ".join(player_rows)
        + "\n),\nins AS (\n"
        "  INSERT INTO app.game (store_id, client_game_id, started_at, finished, ended_by, manual, east_only,\n"
        "                        settings, raw, payload_sha256, app_version)\n"
        f"  SELECT st.id, src.cid, src.local_ts::timestamp AT TIME ZONE 'Asia/Seoul', true, {lit(ENDED_BY)}, true, false,\n"
        f"         src.settings, src.raw, src.sha, {lit(APP_VERSION)}\n"
        f"  FROM src CROSS JOIN (SELECT id FROM app.store WHERE key_hash = {lit(STORE_KEY_HASH)}) st\n"
        "  ON CONFLICT (store_id, client_game_id) DO NOTHING\n"
        "  RETURNING id, client_game_id\n"
        ")\n"
        "INSERT INTO app.game_player (game_id, seat, name, final_points, rank, score, stars, bust)\n"
        "SELECT ins.id, pl.seat, pl.name, pl.final_points, pl.rank, pl.score, pl.stars, pl.final_points < 0\n"
        "FROM ins JOIN pl ON pl.cid = ins.client_game_id;\n"
    )


def build_sql(games: list[dict], batch: int = 500, source: str = "") -> str:
    parts = [
        f"-- 마블리 대국 가져오기({len(games)}판). scripts/import_mavely.py 가 만듦{' — ' + source if source else ''}.\n",
        "-- 여러 번 부어도 같은 결과((store, client_game_id) 가 있으면 건너뜀).\n",
        "SET client_encoding = 'UTF8';\n",
        "SET standard_conforming_strings = on;\n",
        "BEGIN;\n",
        "INSERT INTO app.store (name, key_hash, revoked_at)\n"
        f"VALUES ({lit(STORE_NAME)}, {lit(STORE_KEY_HASH)}, now())\n"
        "ON CONFLICT (key_hash) DO NOTHING;\n",
    ]
    for k in range(0, len(games), batch):
        parts.append(batch_sql(games[k : k + batch]))
    parts.append("COMMIT;\n")
    return "".join(parts)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("input", type=Path, help="mavely_games.json")
    ap.add_argument("-o", "--out", type=Path, default=DEFAULT_OUT)
    ap.add_argument("--batch", type=int, default=500, help="INSERT 한 번에 넣는 대국 수(기본 500)")
    a = ap.parse_args(argv)
    if a.batch < 1:
        ap.error("--batch 는 1 이상")

    data = json.loads(a.input.read_text(encoding="utf-8"))
    games = data["games"] if isinstance(data, dict) else data
    ok, skipped = select_games(games)
    sql = build_sql(ok, a.batch, f"입력 fetched_at {data.get('fetched_at')}" if isinstance(data, dict) else "")
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_bytes(sql.encode("utf-8"))  # BOM 없음 · LF

    names = {p[1] for g in ok for p in players(g)}
    off_rule = sum(1 for g in ok if not uma_matches(g))
    print(f"입력 {len(games)}판 → 넣을 것 {len(ok)}판 · 건너뜀 {len(skipped)}판 · 멤버 {len(names)}명")
    if off_rule:
        print(f"  uma 가 마블리 규칙(버림 + 20/10/−10/−20)과 다른 판 {off_rule} — 넣되 settings 에 우마는 안 적음")
    reasons: dict[str, list] = {}
    for gid, why in skipped:
        reasons.setdefault(why, []).append(gid)
    for why, ids in sorted(reasons.items(), key=lambda t: -len(t[1])):
        print(f"  건너뜀 {len(ids)}: {why} — id {ids[:10]}{' …' if len(ids) > 10 else ''}")
    print(f"→ {a.out} ({a.out.stat().st_size:,} 바이트)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
