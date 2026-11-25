"""대국 기록 사이트 서버. 모든 경로는 /records 아래(Caddy 가 접두어를 떼지 않고 넘긴다)."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse, RedirectResponse, Response

from . import db
from .admin import router as admin_router
from .api import router as api_router
from .config import Settings

PREFIX = "/records"
MAX_BODY = 2 * 1024 * 1024  # 본문 2MB 상한(설계 4절)

log = logging.getLogger("records")

SECURITY_HEADERS = [
    (b"x-robots-tag", b"noindex, nofollow"),
    (b"x-content-type-options", b"nosniff"),
    (b"referrer-policy", b"same-origin"),
    (b"x-frame-options", b"DENY"),
    (
        b"content-security-policy",
        b"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; "
        b"connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    ),
]


class _TooLarge(Exception):
    pass


class GuardMiddleware:
    """본문 2MB 상한(Content-Length 와 실제로 읽은 양 둘 다) + 모든 응답에 색인 막기 · 보안 머리글."""

    def __init__(self, app, max_body: int = MAX_BODY):
        self.app = app
        self.max_body = max_body

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)

        for k, v in scope.get("headers", []):
            if k == b"content-length":
                try:
                    too_big = int(v) > self.max_body
                except ValueError:
                    too_big = True
                if too_big:
                    return await self._reject(send)

        seen = 0
        started = False

        async def limited_receive():
            nonlocal seen
            msg = await receive()
            if msg["type"] == "http.request":
                seen += len(msg.get("body", b""))
                if seen > self.max_body:
                    raise _TooLarge()
            return msg

        async def send_with_headers(msg):
            nonlocal started
            if msg["type"] == "http.response.start":
                started = True
                names = {k.lower() for k, _ in msg.get("headers", [])}
                msg["headers"] = list(msg.get("headers", [])) + [(k, v) for k, v in SECURITY_HEADERS if k not in names]
            await send(msg)

        try:
            await self.app(scope, limited_receive, send_with_headers)
        except _TooLarge:
            if not started:
                await self._reject(send)

    async def _reject(self, send):
        body = '{"detail":"본문이 2MB 를 넘습니다"}'.encode()
        await send({
            "type": "http.response.start",
            "status": 413,
            "headers": [(b"content-type", b"application/json"), (b"content-length", str(len(body)).encode())]
            + SECURITY_HEADERS,
        })
        await send({"type": "http.response.body", "body": body})


def create_app(settings: Settings | None = None) -> FastAPI:
    """uvicorn --factory app.main:create_app 로 띄우면 환경변수에서 설정을 읽는다."""
    settings = settings or Settings.from_env()
    if not logging.getLogger().handlers:  # uvicorn 은 자기 로거만 설정한다 — 마이그레이션 · healthz 로그가 보이게
        logging.basicConfig(level=logging.INFO, format="%(levelname)s:     %(name)s: %(message)s")

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        db.migrate(settings.database_url, settings.migrations_dir)
        pool = db.make_pool(settings.database_url, settings.pool_max)
        pool.open(wait=True, timeout=30)
        app.state.pool = pool
        try:
            yield
        finally:
            pool.close()

    app = FastAPI(
        title="mahjong-records",
        lifespan=lifespan,
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )
    app.state.settings = settings
    app.add_middleware(GuardMiddleware)

    app.include_router(api_router, prefix=PREFIX)
    app.include_router(admin_router, prefix=PREFIX)

    @app.get(PREFIX + "/healthz")
    def healthz(request: Request):
        try:
            with request.app.state.pool.connection(timeout=5) as conn:
                conn.execute("SELECT 1").fetchone()
        except Exception:  # noqa: BLE001 — 어떤 DB 오류든 503
            log.exception("healthz: DB 연결 실패")
            return JSONResponse({"ok": False, "db": False, "git_sha": settings.git_sha}, status_code=503)
        return {"ok": True, "db": True, "git_sha": settings.git_sha}

    @app.get(PREFIX + "/robots.txt", include_in_schema=False)
    def robots():
        return PlainTextResponse("User-agent: *\nDisallow: /\n")

    @app.get(PREFIX, include_in_schema=False)
    def root_redirect():
        return RedirectResponse(PREFIX + "/", status_code=308)

    static_root = Path(settings.static_dir).resolve()

    @app.get(PREFIX + "/{path:path}", include_in_schema=False)
    def spa(path: str):
        # /records/api 아래는 SPA 로 넘기지 않는다(없는 API 는 JSON 404).
        if path == "api" or path.startswith("api/"):
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        if path:
            f = (static_root / path).resolve()
            if f.is_relative_to(static_root) and f.is_file():
                headers = {"cache-control": "public, max-age=31536000, immutable"} if path.startswith("assets/") else {}
                return FileResponse(f, headers=headers)
            if path.startswith("assets/"):  # 해시 붙은 파일이 없으면 index.html 이 아니라 404
                return Response(status_code=404)
        index = static_root / "index.html"
        if not index.is_file():
            return PlainTextResponse("프론트 빌드가 없습니다(web/dist).", status_code=503)
        return FileResponse(index, headers={"cache-control": "no-cache"})

    return app
