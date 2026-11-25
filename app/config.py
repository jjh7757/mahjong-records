"""환경변수 설정. 비밀값(DATABASE_URL · ADMIN_PASSWORD_HASH · SESSION_SECRET)은 환경변수로만 받는다."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _bool(v: str | None, default: bool) -> bool:
    if v is None or v == "":
        return default
    return v.strip().lower() in ("1", "true", "yes", "on")


@dataclass
class Settings:
    database_url: str
    admin_password_hash: str = ""
    session_secret: str = ""
    static_dir: Path = field(default_factory=lambda: ROOT / "web" / "dist")
    migrations_dir: Path = field(default_factory=lambda: ROOT / "migrations")
    # 쿠키 Secure. 운영(https)은 켜 둔다. 로컬 http 로 관리자 화면을 볼 때만 끈다.
    cookie_secure: bool = True
    # 앱 Game.startedAt 은 시간대 없는 지역 시각이라 이 시간대로 읽는다. 월별 집계 · 기간 거르기도 이 시간대.
    timezone: str = "Asia/Seoul"
    git_sha: str = "unknown"
    pool_max: int = 3

    @classmethod
    def from_env(cls) -> "Settings":
        url = os.environ.get("DATABASE_URL", "")
        if not url:
            raise RuntimeError("DATABASE_URL 이 없습니다")
        s = cls(
            database_url=url,
            admin_password_hash=os.environ.get("ADMIN_PASSWORD_HASH", ""),
            session_secret=os.environ.get("SESSION_SECRET", ""),
            cookie_secure=_bool(os.environ.get("COOKIE_SECURE"), True),
            timezone=os.environ.get("APP_TIMEZONE", "Asia/Seoul"),
            git_sha=os.environ.get("GIT_SHA", "unknown"),
        )
        if os.environ.get("STATIC_DIR"):
            s.static_dir = Path(os.environ["STATIC_DIR"])
        return s
