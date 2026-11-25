from conftest import ADMIN_PASSWORD, XRW, login

LOGIN = "/records/api/admin/login"


def test_login_cookie_flags_and_logout(client):
    assert client.get("/records/api/admin/me").json()["admin"] is False
    r = client.post(LOGIN, json={"password": ADMIN_PASSWORD}, headers=XRW)
    assert r.status_code == 200
    sc = r.headers["set-cookie"].lower()
    for flag in ("httponly", "secure", "samesite=strict", "path=/records", "max-age=43200"):
        assert flag in sc, flag
    assert client.get("/records/api/admin/me").json()["admin"] is True
    token = client.cookies.get("mjrec_admin")

    # 쓰기는 X-Requested-With 가 있어야
    assert client.post("/records/api/admin/stores", json={"name": "a"}).status_code == 403
    assert client.post("/records/api/admin/stores", json={"name": "a"}, headers=XRW).status_code == 200

    assert client.post("/records/api/admin/logout", headers=XRW).status_code == 200
    # 로그아웃한 쿠키를 다시 붙여도 안 됨(세션 세대가 바뀜)
    client.cookies.set("mjrec_admin", token, domain="testserver", path="/records")
    assert client.get("/records/api/admin/stores").status_code == 401


def test_admin_routes_need_login(client):
    assert client.get("/records/api/admin/stores").status_code == 401
    assert client.post("/records/api/admin/stores", json={"name": "a"}, headers=XRW).status_code == 401
    assert client.post("/records/api/admin/games/1/hide", headers=XRW).status_code == 401
    client.cookies.set("mjrec_admin", "forged.token", domain="testserver", path="/records")
    assert client.get("/records/api/admin/stores").status_code == 401


def test_login_lockout(client, db):
    for i in range(4):
        r = client.post(LOGIN, json={"password": "wrong"}, headers=XRW)
        assert r.status_code == 401, r.text
    r = client.post(LOGIN, json={"password": "wrong"}, headers=XRW)
    assert r.status_code == 429
    # 잠긴 동안은 맞는 비밀번호도 안 됨
    r = client.post(LOGIN, json={"password": ADMIN_PASSWORD}, headers=XRW)
    assert r.status_code == 429 and "Retry-After" in r.headers
    left = db.execute("SELECT extract(epoch FROM locked_until - now()) FROM app.admin_state").fetchone()[0]
    assert 14 * 60 < left <= 15 * 60
    # 15분이 지나면 풀린다
    db.execute("UPDATE app.admin_state SET locked_until = now() - interval '1 second'")
    assert client.post(LOGIN, json={"password": ADMIN_PASSWORD}, headers=XRW).status_code == 200
    assert db.execute("SELECT failures FROM app.admin_state").fetchone()[0] == 0


def test_login_needs_xrw(client):
    assert client.post(LOGIN, json={"password": ADMIN_PASSWORD}).status_code == 403


def test_store_key_shown_once_and_hashed(client, db):
    login(client)
    r = client.post("/records/api/admin/stores", json={"name": "본점"}, headers=XRW).json()
    assert len(r["key"]) >= 43
    listed = client.get("/records/api/admin/stores").json()["stores"]
    assert "key" not in listed[0] and listed[0]["name"] == "본점"
    stored = db.execute("SELECT key_hash FROM app.store").fetchone()[0]
    assert stored != r["key"] and len(stored) == 64


def test_spa_fallback_and_static(client):
    r = client.get("/records/")
    assert r.status_code == 200 and "<div id=root>" in r.text
    assert r.headers["x-robots-tag"].startswith("noindex")
    r = client.get("/records/members/%EC%B2%A0%EC%88%98")  # /members/철수 — 앱 안 경로는 index.html
    assert r.status_code == 200 and "<div id=root>" in r.text
    assert client.get("/records/games/12/paifu/0").status_code == 200
    r = client.get("/records/assets/app-abc123.js")
    assert r.status_code == 200 and "console.log" in r.text and "immutable" in r.headers["cache-control"]
    assert client.get("/records/assets/missing.js").status_code == 404
    # /records/api 아래는 SPA 로 넘기지 않음
    r = client.get("/records/api/v1/nothing")
    assert r.status_code == 404 and r.headers["content-type"].startswith("application/json")
    assert client.get("/records/api").status_code == 404
    # 경로 밖 파일
    assert "<div id=root>" in client.get("/records/..%2F..%2Fpyproject.toml").text
    r = client.get("/records", follow_redirects=False)
    assert r.status_code == 308 and r.headers["location"] == "/records/"
    assert "Disallow: /" in client.get("/records/robots.txt").text


def test_healthz(client):
    r = client.get("/records/healthz")
    assert r.status_code == 200 and r.json() == {"ok": True, "db": True, "git_sha": "test"}
