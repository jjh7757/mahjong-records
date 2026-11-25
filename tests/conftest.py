"""실제 Postgres 에 대고 시험한다.

TEST_DATABASE_URL(기본 postgresql://postgres:x@localhost:55433/postgres). 로컬:
    docker run -d --rm --name mjrec-test -e POSTGRES_PASSWORD=x -p 55433:5432 postgres:16-alpine
시험 시작 때 schema app 을 지우고 다시 만든다 — 운영 DB 에 대고 돌리지 말 것.
"""
from __future__ import annotations

import os
from pathlib import Path

import psycopg
import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app
from app.security import hash_password

DB_URL = os.environ.get("TEST_DATABASE_URL", "postgresql://postgres:x@localhost:55433/postgres")
ADMIN_PASSWORD = "correct horse battery staple"
SESSION_SECRET = "test-session-secret-0123456789abcdef"
XRW = {"X-Requested-With": "XMLHttpRequest"}


@pytest.fixture(scope="session")
def static_dir(tmp_path_factory) -> Path:
    d = tmp_path_factory.mktemp("dist")
    (d / "index.html").write_text("<!doctype html><title>기록</title><div id=root></div>", encoding="utf-8")
    (d / "assets").mkdir()
    (d / "assets" / "app-abc123.js").write_text("console.log(1)", encoding="utf-8")
    (d / "favicon.svg").write_text("<svg xmlns='http://www.w3.org/2000/svg'/>", encoding="utf-8")
    return d


@pytest.fixture(scope="session")
def settings(static_dir) -> Settings:
    with psycopg.connect(DB_URL, autocommit=True) as conn:
        conn.execute("DROP SCHEMA IF EXISTS app CASCADE")
    return Settings(
        database_url=DB_URL,
        admin_password_hash=hash_password(ADMIN_PASSWORD, n=2**10),  # 시험은 가벼운 n
        session_secret=SESSION_SECRET,
        static_dir=static_dir,
        cookie_secure=True,
        git_sha="test",
    )


@pytest.fixture(scope="session")
def app(settings):
    return create_app(settings)


@pytest.fixture
def client(app):
    # https 로 부르면 Secure 쿠키가 오간다.
    with TestClient(app, base_url="https://testserver") as c:
        with psycopg.connect(DB_URL, autocommit=True) as conn:
            conn.execute(
                "TRUNCATE app.paifu_round, app.game_event, app.game_player, app.game, app.store RESTART IDENTITY CASCADE"
            )
            conn.execute("UPDATE app.admin_state SET failures = 0, locked_until = NULL, session_epoch = 0")
        yield c


@pytest.fixture
def db():
    with psycopg.connect(DB_URL, autocommit=True) as conn:
        yield conn


def login(client) -> None:
    r = client.post("/records/api/admin/login", json={"password": ADMIN_PASSWORD}, headers=XRW)
    assert r.status_code == 200, r.text


@pytest.fixture
def store_key(client) -> str:
    login(client)
    r = client.post("/records/api/admin/stores", json={"name": "시험 매장"}, headers=XRW)
    assert r.status_code == 200, r.text
    client.cookies.clear()
    return r.json()["key"]
