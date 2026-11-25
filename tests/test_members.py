"""멤버 집계가 앱 lib/game/member_stats.dart(memberStats)와 같은지. 기대값은 손으로 셈."""
from conftest import XRW, login
from helpers import payload

URL = "/records/api/v1/games"

# 손으로 만든 대국 넷. 정산은 helpers.settle(= Game.settle) 로 만들고, 기대 집계는 아래 주석대로 손으로 셈.
GAMES = [
    # G1 오사육입: 철수 55 · 영희 10 · 민수 -25 · 지영 -40, 철수 별 2
    ("G1", "2026-10-03T19:00:00", ["철수", "영희", "민수", "지영"], [45000, 30000, 15000, 10000], {}, (2, 0, 0, 0)),
    # G2 소수 한 자리: 영희 48.4 · 민수 11.2 · 지영 -14.5 · 철수 -45.1
    ("G2", "2026-10-20T19:00:00", ["철수", "영희", "민수", "지영"], [4900, 38400, 31200, 25500], {"roundingMode": 0}, (0, 3, 0, 0)),
    # G3 동점(민수 · 하늘 30000 — 기동 자리 순) + 토비: 영희 51 · 민수 10 · 하늘 -10 · 철수 -51
    ("G3", "2026-11-01T19:00:00", ["민수", "하늘", "영희", "철수"], [30000, 30000, 41000, -1000], {}, (0, 0, 0, 0)),
    # G4 오사육입 경계(600 올림 · 500 버림): 지영 47 · 하늘 9 · 철수 -20 · 영희 -35, 지영 별 1
    ("G4", "2026-11-14T19:00:00", ["지영", "하늘", "철수", "영희"], [36600, 28500, 20400, 14500], {}, (1, 0, 0, 0)),
]

EXPECTED = [
    # name, games, total, rank_counts, busts, stars, best, avg_rank
    ("영희", 4, 74.4, [2, 1, 0, 1], 0, 3, 41000, 2.0),
    ("하늘", 2, -1.0, [0, 1, 1, 0], 0, 0, 30000, 2.5),
    ("민수", 3, -3.8, [0, 2, 1, 0], 0, 0, 31200, 7 / 3),
    ("지영", 3, -7.5, [1, 0, 1, 1], 0, 1, 36600, 8 / 3),
    ("철수", 4, -61.1, [1, 0, 1, 2], 1, 2, 45000, 3.0),
]


def _upload_all(client, key):
    ids = {}
    for gid, started, names, scores, st, stars in GAMES:
        r = client.post(URL, json=payload(gid, started, names, scores, settings=st, stars=stars), headers={"X-Store-Key": key})
        assert r.status_code == 200, r.text
        ids[gid] = r.json()["id"]
    return ids


def test_settlements_match_hand_numbers():
    from helpers import settle

    s = {r["name"]: r["score"] for r in settle(*GAMES[1][2:4], {**__import__("helpers").DEFAULT_SETTINGS, "roundingMode": 0})}
    assert s == {"영희": 48.4, "민수": 11.2, "지영": -14.5, "철수": -45.1}
    s = {r["name"]: (r["rank"], r["score"]) for r in settle(*GAMES[2][2:4])}
    assert s == {"영희": (1, 51.0), "민수": (2, 10.0), "하늘": (3, -10.0), "철수": (4, -51.0)}
    s = {r["name"]: r["score"] for r in settle(*GAMES[3][2:4])}
    assert s == {"지영": 47.0, "하늘": 9.0, "철수": -20.0, "영희": -35.0}


def test_member_stats_like_app(client, store_key):
    _upload_all(client, store_key)
    got = client.get("/records/api/v1/members").json()["members"]
    assert [m["name"] for m in got] == [e[0] for e in EXPECTED]
    for m, (name, games, total, ranks, busts, stars, best, avg) in zip(got, EXPECTED):
        assert m["games"] == games, name
        assert m["total"] == total, name
        assert m["rank_counts"] == ranks, name
        assert m["busts"] == busts, name
        assert m["stars"] == stars, name
        assert m["best"] == best, name
        assert abs(m["avg_rank"] - avg) < 1e-3, name
        assert abs(m["top_rate"] - ranks[0] / games) < 1e-3
        assert abs(m["last_rate"] - ranks[3] / games) < 1e-3


def test_period_filter(client, store_key):
    _upload_all(client, store_key)
    got = client.get("/records/api/v1/members", params={"from": "2026-11-01", "to": "2026-11-14"}).json()["members"]
    by = {m["name"]: m for m in got}
    assert by["영희"]["games"] == 2 and by["영희"]["total"] == 16.0  # G3 51 + G4 -35
    assert "철수" in by and by["철수"]["total"] == -71.0
    assert client.get("/records/api/v1/members", params={"from": "2026-13-01"}).status_code == 422


def test_sort_ties(client, store_key):
    """정산 합이 같으면 평균 순위, 그것도 같으면 이름 순."""
    from helpers import game_json

    def up(gid, rows):  # rows: (name, rank, score)
        names = [r[0] for r in rows]
        g = game_json(gid, "2026-11-20T12:00:00", names, [25000] * 4)
        st = [{"seat": i, "name": n, "rank": rk, "points": 25000, "score": sc, "stars": 0} for i, (n, rk, sc) in enumerate(rows)]
        r = client.post(URL, json={"game": g, "settlement": st, "paifu": [], "app_version": "t"}, headers={"X-Store-Key": store_key})
        assert r.status_code == 200, r.text

    up("P", [("나", 1, 20.0), ("가", 2, 0.0), ("다", 3, -5.0), ("라", 4, -15.0)])
    up("Q", [("가", 1, 20.0), ("나", 2, 0.0), ("다", 3, -5.0), ("라", 4, -15.0)])
    up("R", [("마", 2, 10.0), ("x1", 1, 0.0), ("x2", 3, -5.0), ("x3", 4, -5.0)])
    up("S", [("바", 1, 10.0), ("y1", 2, 0.0), ("y2", 3, -5.0), ("y3", 4, -5.0)])
    names = [m["name"] for m in client.get("/records/api/v1/members").json()["members"]]
    assert names[:4] == ["가", "나", "바", "마"]


def test_member_detail_and_games_list(client, store_key):
    ids = _upload_all(client, store_key)
    d = client.get("/records/api/v1/members/철수").json()
    assert d["member"]["total"] == -61.1
    assert [g["id"] for g in d["games"]] == [ids["G4"], ids["G3"], ids["G2"], ids["G1"]]
    assert [f["rank"] for f in d["rank_flow"]] == [1, 4, 4, 3]  # 오래된 것부터
    assert client.get("/records/api/v1/members/없는사람").status_code == 404

    lst = client.get("/records/api/v1/games", params={"member": "하늘"}).json()
    assert lst["total"] == 2 and [g["id"] for g in lst["items"]] == [ids["G4"], ids["G3"]]
    g3 = client.get(f"/records/api/v1/games/{ids['G3']}").json()
    assert [p["name"] for p in g3["players"]] == ["민수", "하늘", "영희", "철수"]
    assert g3["players"][3]["bust"] is True and g3["players"][3]["rank"] == 4
    assert len(g3["events"]) == 4 and g3["events"][1]["kind"] == "win"

    ov = client.get("/records/api/v1/overview").json()
    assert ov["games"] == 4 and ov["members"] == 5
    assert ov["monthly"] == [{"month": "2026-10", "games": 2}, {"month": "2026-11", "games": 2}]
    assert ov["hands"]["win"] == 4 and ov["hands"]["draw"] == 4


def test_hidden_game_excluded(client, store_key):
    ids = _upload_all(client, store_key)
    login(client)
    assert client.post(f"/records/api/admin/games/{ids['G4']}/hide", headers=XRW).json()["hidden"] is True
    client.cookies.clear()

    lst = client.get("/records/api/v1/games").json()
    assert lst["total"] == 3 and ids["G4"] not in [g["id"] for g in lst["items"]]
    assert client.get(f"/records/api/v1/games/{ids['G4']}").status_code == 404
    by = {m["name"]: m for m in client.get("/records/api/v1/members").json()["members"]}
    assert by["영희"]["total"] == 109.4 and by["영희"]["games"] == 3  # G4 의 -35 가 빠짐
    assert client.get("/records/api/v1/overview").json()["games"] == 3

    # 관리자 목록에는 남아 있고 되살릴 수 있다
    login(client)
    adm = client.get("/records/api/admin/games").json()
    assert {g["id"]: g["hidden"] for g in adm["items"]}[ids["G4"]] is True
    client.post(f"/records/api/admin/games/{ids['G4']}/unhide", headers=XRW)
    client.cookies.clear()
    assert client.get("/records/api/v1/games").json()["total"] == 4
