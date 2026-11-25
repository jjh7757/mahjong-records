"""scripts/import_mavely.py 가 만든 SQL 을 실제 Postgres 에 부어 본다(작은 가짜 입력)."""
from __future__ import annotations

import copy
import json
from datetime import datetime, timedelta, timezone

from scripts import import_mavely as im

KST = timezone(timedelta(hours=9))


def mav(gid, date, names, rates, *, deposit=0, stars=(0, 0, 0, 0), season="2026-S11"):
    """마블리 한 판(정산은 마블리 규칙: rate/1000 을 0 쪽으로 버림 + 20/10/−10/−20, 동점은 기동 자리 순)."""
    order = sorted(range(4), key=lambda s: (-rates[s], s))
    rank = {s: r + 1 for r, s in enumerate(order)}
    g = {"id": gid, "date": date, "game_date": date[:10], "deposit": deposit}
    for i in range(4):
        g[f"wind_{i + 1}"] = "東南西北"[i]
        g[f"name_{i + 1}"] = names[i]
        g[f"rate_{i + 1}"] = rates[i]
        g[f"uma_{i + 1}"] = im.trunc_thousands(rates[i]) + im.UMA[rank[i]]
        g[f"ranking_{i + 1}"] = rank[i]
        g[f"star_{i + 1}"] = stars[i]
    g.update(giftwinner_set=[], awardwinner_set=[], _season=season)
    return g


GOOD = [
    # 철수 +65(45500 → 45 + 20) · 영희 4(−6800 → −6 + 10) · 민수 −28 · 지영 −39, 철수 별 2
    mav(101, "2026-11-23 23:12", ["철수", "영희", "민수", "지영"], [45500, -6800, -18800, -19900], stars=(2, 0, 0, 0)),
    # 공탁 1000 남음(합 −1000), 토비(지영 −1200 점), 이름에 작은따옴표
    mav(102, "2026-11-24 00:30", ["지영", "O'Neil", "철수", "영희"], [-26200, 30100, 3000, -7900], deposit=1000),
    # 동점(민수 · 하늘 0) — 기동 자리 순
    mav(103, "2026-10-05 19:00", ["민수", "하늘", "영희", "철수"], [0, 0, 20000, -20000], season="2026-S10"),
]


def bad_inputs():
    dup_name = mav(201, "2026-11-01 10:00", ["가", "나", "다", "가"], [10000, 0, -5000, -5000])
    bad_rank = mav(202, "2026-11-01 10:00", ["가", "나", "다", "라"], [10000, 0, -5000, -5000])
    bad_rank["ranking_2"] = 1
    empty = mav(203, "2026-11-01 10:00", ["가", " ", "다", "라"], [10000, 0, -5000, -5000])
    bad_sum = mav(204, "2026-11-01 10:00", ["가", "나", "다", "라"], [10000, 0, -5000, -4000])
    dup_id = copy.deepcopy(GOOD[0])
    return [dup_name, bad_rank, empty, bad_sum, dup_id]


def run_sql(db, sql: str) -> None:
    db.execute(sql)  # 매개변수 없이 보내면 여러 문장(BEGIN … COMMIT)을 한 번에


def test_select_games_skips_with_reasons():
    ok, skipped = im.select_games(GOOD + bad_inputs())
    assert [g["id"] for g in ok] == [101, 102, 103]
    assert dict(skipped) == {
        201: "같은 판에 같은 이름",
        202: "순위가 1~4 를 한 번씩이 아님",
        203: "이름이 빈 자리",
        204: "rate 합이 −deposit 이 아님",
        101: "id 가 입력 안에서 겹침",
    }
    assert all(im.uma_matches(g) for g in ok)


def test_sql_inserts_rows_once(client, db):
    ok, _ = im.select_games(GOOD)
    sql = im.build_sql(ok, batch=2)  # 묶음 둘(2 + 1)
    run_sql(db, sql)

    store = db.execute("SELECT id, name, key_hash, revoked_at IS NOT NULL FROM app.store").fetchall()
    assert len(store) == 1 and store[0][1:] == ("마블리 가져옴", "import-only:mavely", True)
    games = db.execute(
        "SELECT client_game_id, started_at AT TIME ZONE 'Asia/Seoul', finished, manual, east_only, ended_by, "
        "settings, raw, payload_sha256, app_version FROM app.game ORDER BY id"
    ).fetchall()
    assert [g[0] for g in games] == ["mavely-101", "mavely-102", "mavely-103"]
    cid, local, finished, manual, east_only, ended_by, settings, raw, sha, ver = games[0]
    assert local.isoformat() == "2026-11-23T23:12:00"
    assert (finished, manual, east_only, ended_by, ver) == (True, True, False, "마블리 가져옴", "import-mavely")
    assert settings == {"source": "mavely", "season": "2026-S11", "eastOnly": False,
                        "startPoints": 25000, "returnPoints": 25000, "umaBig": 20, "umaSmall": 10}
    assert raw == GOOD[0]
    assert sha == im.canonical_sha256(GOOD[0])

    rows = db.execute(
        "SELECT g.client_game_id, p.seat, p.name, p.final_points, p.rank, p.score, p.stars, p.bust "
        "FROM app.game_player p JOIN app.game g ON g.id = p.game_id ORDER BY g.id, p.seat"
    ).fetchall()
    assert len(rows) == 12
    assert [(r[1], r[2], r[3], r[4], float(r[5]), r[6], r[7]) for r in rows[:4]] == [
        (0, "철수", 70500, 1, 65.0, 2, False),
        (1, "영희", 18200, 2, 4.0, 0, False),
        (2, "민수", 6200, 3, -28.0, 0, False),
        (3, "지영", 5100, 4, -39.0, 0, False),
    ]
    g2 = {r[2]: (r[3], r[4], float(r[5]), r[7]) for r in rows[4:8]}
    assert g2 == {"지영": (-1200, 4, -46.0, True), "O'Neil": (55100, 1, 50.0, False),
                  "철수": (28000, 2, 13.0, False), "영희": (17100, 3, -17.0, False)}
    g3 = {r[2]: r[4] for r in rows[8:]}
    assert g3 == {"영희": 1, "민수": 2, "하늘": 3, "철수": 4}

    # 두 번째: 아무것도 안 넣는다
    before = db.execute("SELECT id, uploaded_at FROM app.game ORDER BY id").fetchall()
    run_sql(db, sql)
    assert db.execute("SELECT count(*) FROM app.store").fetchone()[0] == 1
    assert db.execute("SELECT id, uploaded_at FROM app.game ORDER BY id").fetchall() == before
    assert db.execute("SELECT count(*) FROM app.game_player").fetchone()[0] == 12

    # 새 판이 하나 더 있는 입력을 부으면 그 판만 들어간다
    extra = mav(104, "2026-11-25 20:00", ["하늘", "철수", "영희", "민수"], [5000, 5000, -5000, -5000])
    run_sql(db, im.build_sql(ok + [extra]))
    assert db.execute("SELECT count(*) FROM app.game").fetchone()[0] == 4
    assert db.execute("SELECT count(*) FROM app.game_player").fetchone()[0] == 16


def test_imported_games_through_api(client, db, store_key):
    ok, _ = im.select_games(GOOD)
    run_sql(db, im.build_sql(ok))

    # 가져옴 매장은 업로드에 못 쓴다(표식 문자열을 키로 보내도 401)
    r = client.post("/records/api/v1/games", json={}, headers={"X-Store-Key": "import-only:mavely"})
    assert r.status_code == 401

    members = {m["name"]: m for m in client.get("/records/api/v1/members").json()["members"]}
    assert members["철수"]["games"] == 3
    assert members["철수"]["total"] == 38.0  # 101: 65, 102: 13(3000 → 3 + 10), 103: −40(−20000 → −20 − 20)
    assert members["철수"]["rank_counts"] == [1, 1, 0, 1]
    assert members["철수"]["stars"] == 2 and members["철수"]["best"] == 70500
    assert members["지영"]["busts"] == 1
    # 기간: 10월만
    oct_ = {m["name"] for m in client.get("/records/api/v1/members?from=2026-10-01&to=2026-10-31").json()["members"]}
    assert oct_ == {"민수", "하늘", "영희", "철수"}

    page = client.get("/records/api/v1/games").json()
    assert page["total"] == 3
    assert [g["source"] for g in page["items"]] == ["mavely"] * 3
    assert datetime.fromisoformat(page["items"][0]["started_at"]) == datetime(2026, 11, 24, 0, 30, tzinfo=KST)
    gid = page["items"][0]["id"]
    d = client.get(f"/records/api/v1/games/{gid}").json()
    assert d["store"] == "마블리 가져옴" and d["source"] == "mavely"
    assert d["events"] == [] and d["paifu"] == []
    assert "raw" not in d  # 원본(후원 정보 등)은 공개 응답에 안 나감

    ov = client.get("/records/api/v1/overview").json()
    assert ov["games"] == 3 and ov["members"] == 6 and ov["hands"]["total"] == 0
    md = client.get("/records/api/v1/members/철수").json()
    assert len(md["games"]) == 3 and len(md["rank_flow"]) == 3


def test_main_writes_file(tmp_path, capsys):
    src = tmp_path / "in.json"
    src.write_text(json.dumps({"fetched_at": "x", "seasons": [], "games": GOOD + bad_inputs()}, ensure_ascii=False), encoding="utf-8")
    out = tmp_path / "o.sql"
    assert im.main([str(src), "-o", str(out)]) == 0
    text = out.read_bytes().decode("utf-8")
    assert text.startswith("-- 마블리") and "\r\n" not in text
    assert text.count("INSERT INTO app.game (") == 1
    printed = capsys.readouterr().out
    assert "넣을 것 3판" in printed and "건너뜀 5판" in printed
