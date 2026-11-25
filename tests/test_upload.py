import copy
import json

from conftest import XRW, login
from helpers import load_paifu, payload

URL = "/records/api/v1/games"
NAMES = ["철수", "영희", "민수", "지영"]
SCORES = [45000, 30000, 15000, 10000]


def _post(client, key, body, **kw):
    headers = {"X-Store-Key": key} if key is not None else {}
    return client.post(URL, json=body, headers=headers, **kw)


def test_created_unchanged_updated(client, store_key, db):
    body = payload("g-1", "2026-11-14T13:09:21.000", NAMES, SCORES, stars=(2, 0, 0, 0), paifu=[load_paifu("r14_133610.json")])
    r = _post(client, store_key, body)
    assert r.status_code == 200, r.text
    assert r.json()["status"] == "created"
    gid = r.json()["id"]

    # 같은 내용(키 순서만 다름)이면 unchanged
    shuffled = json.loads(json.dumps(body, sort_keys=True))
    r = _post(client, store_key, shuffled)
    assert r.json() == {"status": "unchanged", "id": gid}

    # 내용이 바뀌면 같은 행을 지우고 다시 씀
    body2 = copy.deepcopy(body)
    body2["paifu"].append(load_paifu("r11_130921.json"))
    body2["game"]["events"] = body2["game"]["events"][:2]
    r = _post(client, store_key, body2)
    assert r.json() == {"status": "updated", "id": gid}
    assert db.execute("SELECT count(*) FROM app.game").fetchone()[0] == 1
    assert db.execute("SELECT count(*) FROM app.game_event WHERE game_id = %s", (gid,)).fetchone()[0] == 2
    assert db.execute("SELECT count(*) FROM app.paifu_round WHERE game_id = %s", (gid,)).fetchone()[0] == 2
    assert db.execute("SELECT count(*) FROM app.game_player WHERE game_id = %s", (gid,)).fetchone()[0] == 4

    # 요약 열
    row = db.execute(
        "SELECT paifu_id, round_name, honba, dealer, hero, result_type, winner, loser FROM app.paifu_round "
        "WHERE game_id = %s ORDER BY seq", (gid,)
    ).fetchall()
    assert row[0] == ("r14_133610", "동4국", 1, 3, 2, "tsumo", 2, None)
    assert row[1] == ("r11_130921", "동1국", 0, 0, 3, "ron", 3, 0)
    # 시간대 없는 시각은 Asia/Seoul 로 읽는다
    assert db.execute(
        "SELECT to_char(started_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI') FROM app.game"
    ).fetchone()[0] == "2026-11-14 04:09"


def test_same_client_id_different_store_is_separate(client, store_key):
    login(client)
    other = client.post("/records/api/admin/stores", json={"name": "둘째 매장"}, headers=XRW).json()["key"]
    client.cookies.clear()
    body = payload("same-id", "2026-11-14T13:00:00", NAMES, SCORES)
    assert _post(client, store_key, body).json()["status"] == "created"
    assert _post(client, other, body).json()["status"] == "created"


def test_bad_and_revoked_keys(client, store_key):
    body = payload("g-k", "2026-11-14T13:00:00", NAMES, SCORES)
    assert _post(client, None, body).status_code == 401
    assert _post(client, "not-a-key", body).status_code == 401
    assert _post(client, store_key, body).status_code == 200

    login(client)
    stores = client.get("/records/api/admin/stores").json()["stores"]
    sid = stores[0]["id"]
    r = client.post(f"/records/api/admin/stores/{sid}/revoke", headers=XRW)
    assert r.status_code == 200 and r.json()["revoked_at"]
    client.cookies.clear()
    r = _post(client, store_key, body)
    assert r.status_code == 401


def test_validation(client, store_key):
    good = payload("g-v", "2026-11-14T13:00:00", NAMES, SCORES)

    def bad(mutate):
        b = copy.deepcopy(good)
        mutate(b)
        r = _post(client, store_key, b)
        assert r.status_code == 422, (r.status_code, r.text)
        return r.json()["detail"]

    assert "4개" in bad(lambda b: b["settlement"].pop())
    assert "순위" in bad(lambda b: b["settlement"][1].__setitem__("rank", 1))
    assert "자리" in bad(lambda b: b["settlement"][1].__setitem__("seat", b["settlement"][0]["seat"]))
    assert "name" in bad(lambda b: b["settlement"][2].__setitem__("name", "  "))
    bad(lambda b: b["game"].__setitem__("names", ["a", "b", "c"]))
    bad(lambda b: b["game"].pop("id"))
    bad(lambda b: b["game"].__setitem__("startedAt", "어제"))
    bad(lambda b: b["game"]["events"][0].__setitem__("delta", [1, 2]))
    bad(lambda b: b["paifu"].append({"version": 2, "hero": 0, "events": []}))
    bad(lambda b: b["paifu"].append({"version": 1, "hero": 7, "events": []}))
    bad(lambda b: b.__setitem__("settlement", "x"))

    r = client.post(URL, content=b"{not json", headers={"X-Store-Key": store_key, "Content-Type": "application/json"})
    assert r.status_code == 400
    assert _post(client, store_key, good).status_code == 200


def test_body_limit(client, store_key):
    big = payload("g-big", "2026-11-14T13:00:00", NAMES, SCORES)
    big["paifu"] = [{"version": 1, "hero": 0, "events": [], "note": "x" * (2 * 1024 * 1024)}]
    r = _post(client, store_key, big)
    assert r.status_code == 413
    assert r.headers["x-robots-tag"].startswith("noindex")


def test_body_limit_chunked(client, store_key):
    """Content-Length 없이(청크) 보내도 2MB 에서 끊는다."""
    def gen():
        for _ in range(40):
            yield b"x" * (64 * 1024)

    r = client.post(URL, content=gen(), headers={"X-Store-Key": store_key, "Content-Type": "application/json"})
    assert r.status_code == 413
