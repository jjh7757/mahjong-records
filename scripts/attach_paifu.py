"""가져온 대국(예: 마블리)에 패보 파일을 붙이는 SQL 을 만든다. 표준 라이브러리만, DB 에 직접 붙지 않음.

    python scripts/attach_paifu.py <client_game_id> <패보.json ...> [--out out/attach_<id>.sql]

- 패보 자리 번호(0 = 기동 동)가 그 대국의 자리 번호와 같다고 본다(마블리 name_1..4 = 동남서북).
- 그 대국의 패보를 지우고 다시 넣는다(여러 번 부어도 같은 결과). 순서는 파일 순서.
- 대국은 client_game_id 로 찾고, 없으면 실패(ON_ERROR_STOP 으로 멈춤).
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def q(s: str | None) -> str:
    if s is None:
        return "NULL"
    return "'" + str(s).replace("\x00", "").replace("'", "''") + "'"


def num(v) -> str:
    return "NULL" if v is None else str(int(v))


def build(client_game_id: str, files: list[Path]) -> str:
    rows = []
    for i, f in enumerate(files):
        p = json.loads(f.read_text(encoding="utf-8"))
        r = p.get("result") or {}
        rows.append(
            "(" + ", ".join([
                str(i), q(p["id"]), q(p["round"]), num(p.get("honba", 0)), num(p["dealer"]), num(p["hero"]),
                q(r.get("type")), num(r.get("winner")), num(r.get("loser")),
                q(json.dumps(p, ensure_ascii=False, sort_keys=True)) + "::jsonb",
            ]) + ")"
        )
    gid = f"(SELECT id FROM app.game WHERE client_game_id = {q(client_game_id)})"
    return "\n".join([
        f"-- {client_game_id} 에 패보 {len(files)}개 붙이기 (scripts/attach_paifu.py)",
        "SET client_encoding = 'UTF8';",
        "SET standard_conforming_strings = on;",
        "BEGIN;",
        # 대국이 정확히 하나인지 확인(없거나 둘 이상이면 멈춤)
        f"DO $$ BEGIN IF (SELECT count(*) FROM app.game WHERE client_game_id = {q(client_game_id)}) <> 1 "
        f"THEN RAISE EXCEPTION 'game % not unique or missing', {q(client_game_id)}; END IF; END $$;",
        f"DELETE FROM app.paifu_round WHERE game_id = {gid};",
        "INSERT INTO app.paifu_round (game_id, seq, paifu_id, round_name, honba, dealer, hero, result_type, winner, loser, raw)",
        f"SELECT {gid}, v.* FROM (VALUES",
        ",\n".join(rows),
        ") AS v(seq, paifu_id, round_name, honba, dealer, hero, result_type, winner, loser, raw);",
        "COMMIT;",
        "",
    ])


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("client_game_id")
    ap.add_argument("files", nargs="+", type=Path)
    ap.add_argument("--out", type=Path)
    a = ap.parse_args(argv)
    out = a.out or Path("out") / f"attach_{a.client_game_id}.sql"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(build(a.client_game_id, a.files).encode("utf-8"))
    print(f"{a.client_game_id}: 패보 {len(a.files)}개 → {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
