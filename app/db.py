"""DB 풀과 마이그레이션.

마이그레이션은 migrations/NNN_*.sql 을 번호 순서대로, app.schema_migrations 에 없는 것만 하나씩 트랜잭션으로 적용한다.
여러 프로세스가 동시에 떠도 advisory lock 으로 한 번만 돈다.
"""
from __future__ import annotations

import logging
import re
from pathlib import Path

import psycopg
from psycopg_pool import ConnectionPool

log = logging.getLogger("records.db")

_MIGRATION_RE = re.compile(r"^(\d{3})_[A-Za-z0-9_]+\.sql$")
_LOCK_KEY = 72_177_001  # 아무 고정 숫자(이 앱의 마이그레이션 잠금)


def list_migrations(directory: Path) -> list[tuple[int, Path]]:
    out = []
    for p in sorted(directory.iterdir()):
        m = _MIGRATION_RE.match(p.name)
        if m:
            out.append((int(m.group(1)), p))
    versions = [v for v, _ in out]
    if len(versions) != len(set(versions)):
        raise RuntimeError(f"마이그레이션 번호가 겹칩니다: {versions}")
    return out


def migrate(conninfo: str, directory: Path) -> list[int]:
    """적용한 번호 목록을 돌려준다."""
    applied_now: list[int] = []
    with psycopg.connect(conninfo, autocommit=True) as conn:
        conn.execute("SELECT pg_advisory_lock(%s)", (_LOCK_KEY,))
        try:
            conn.execute("CREATE SCHEMA IF NOT EXISTS app")
            conn.execute(
                "CREATE TABLE IF NOT EXISTS app.schema_migrations ("
                " version int PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())"
            )
            done = {r[0] for r in conn.execute("SELECT version FROM app.schema_migrations").fetchall()}
            for version, path in list_migrations(directory):
                if version in done:
                    continue
                sql = path.read_text(encoding="utf-8")
                with conn.transaction():
                    conn.execute(sql)
                    conn.execute("INSERT INTO app.schema_migrations (version) VALUES (%s)", (version,))
                log.info("마이그레이션 적용: %s", path.name)
                applied_now.append(version)
        finally:
            conn.execute("SELECT pg_advisory_unlock(%s)", (_LOCK_KEY,))
    return applied_now


def make_pool(conninfo: str, max_size: int = 3) -> ConnectionPool:
    return ConnectionPool(
        conninfo,
        min_size=1,
        max_size=max_size,
        open=False,
        timeout=10,
        kwargs={"autocommit": True},
        check=ConnectionPool.check_connection,
    )
