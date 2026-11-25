"""관리자 API: 로그인(잠금) · 매장 키 발급/폐기 · 대국 숨기기.

쓰기 요청은 관리자 쿠키 + X-Requested-With 머리글이 있어야 한다(같은 출처 fetch 만 붙일 수 있음 — CSRF 막기).
로그인 실패 5번이면 15분 잠금. 관리자는 한 명이라 잠금은 전역(IP 별이 아님).
"""
from __future__ import annotations

from fastapi import APIRouter, Body, Depends, HTTPException, Query, Request, Response
from fastapi.concurrency import run_in_threadpool

from .security import (
    SESSION_COOKIE,
    SESSION_SECONDS,
    new_store_key,
    read_session,
    sign_session,
    store_key_hash,
    verify_password,
)

router = APIRouter(prefix="/api/admin")

MAX_FAILURES = 5
LOCK_MINUTES = 15
PAGE_SIZE = 30
COOKIE_PATH = "/records"


def _require_xrw(request: Request) -> None:
    if not request.headers.get("x-requested-with"):
        raise HTTPException(403, "X-Requested-With 머리글이 필요합니다")


def _admin_configured(request: Request) -> bool:
    s = request.app.state.settings
    return bool(s.admin_password_hash and s.session_secret)


def _is_admin(request: Request) -> bool:
    s = request.app.state.settings
    if not _admin_configured(request):
        return False
    payload = read_session(s.session_secret, request.cookies.get(SESSION_COOKIE))
    if payload is None:
        return False
    with request.app.state.pool.connection() as conn:
        epoch = conn.execute("SELECT session_epoch FROM app.admin_state WHERE id = 1").fetchone()[0]
    return payload.get("ep") == epoch


def require_admin(request: Request) -> None:
    if not _is_admin(request):
        raise HTTPException(401, "관리자 로그인이 필요합니다")


def require_admin_write(request: Request) -> None:
    _require_xrw(request)
    require_admin(request)


def _set_cookie(request: Request, response: Response, value: str, max_age: int) -> None:
    response.set_cookie(
        SESSION_COOKIE,
        value,
        max_age=max_age,
        path=COOKIE_PATH,
        httponly=True,
        secure=request.app.state.settings.cookie_secure,
        samesite="strict",
    )


@router.get("/me")
def me(request: Request):
    return {"admin": _is_admin(request), "configured": _admin_configured(request)}


@router.post("/login")
async def login(request: Request, response: Response, password: str = Body(..., embed=True, max_length=1000)):
    _require_xrw(request)
    if not _admin_configured(request):
        raise HTTPException(503, "관리자 비밀번호 · 세션 키가 서버에 설정되지 않았습니다")
    s = request.app.state.settings

    def work():
        with request.app.state.pool.connection() as conn, conn.transaction():
            failures, locked, left, epoch = conn.execute(
                "SELECT failures, coalesce(locked_until > now(), false), "
                "greatest(0, extract(epoch FROM locked_until - now()))::int, session_epoch "
                "FROM app.admin_state WHERE id = 1 FOR UPDATE"
            ).fetchone()
            if locked:
                return "locked", left, epoch
            if verify_password(password, s.admin_password_hash):
                conn.execute("UPDATE app.admin_state SET failures = 0, locked_until = NULL WHERE id = 1")
                return "ok", 0, epoch
            failures += 1
            if failures >= MAX_FAILURES:
                conn.execute(
                    "UPDATE app.admin_state SET failures = 0, locked_until = now() + make_interval(mins => %s) WHERE id = 1",
                    (LOCK_MINUTES,),
                )
                return "locked_now", LOCK_MINUTES * 60, epoch
            conn.execute("UPDATE app.admin_state SET failures = %s WHERE id = 1", (failures,))
            return "bad", MAX_FAILURES - failures, epoch

    result, n, epoch = await run_in_threadpool(work)
    if result == "ok":
        _set_cookie(request, response, sign_session(s.session_secret, epoch), SESSION_SECONDS)
        return {"ok": True}
    if result == "bad":
        raise HTTPException(401, f"비밀번호가 틀렸습니다(남은 시도 {n}번)")
    raise HTTPException(
        429,
        f"로그인 실패가 {MAX_FAILURES}번이라 잠겼습니다. {max(1, (n + 59) // 60)}분 뒤 다시 하세요",
        headers={"Retry-After": str(max(1, n))},
    )


@router.post("/logout", dependencies=[Depends(_require_xrw)])
def logout(request: Request, response: Response):
    # 세션 세대를 올려 지금까지 낸 쿠키를 모두 무효로 한다(관리자는 한 명).
    if _is_admin(request):
        with request.app.state.pool.connection() as conn:
            conn.execute("UPDATE app.admin_state SET session_epoch = session_epoch + 1 WHERE id = 1")
    _set_cookie(request, response, "", 0)
    return {"ok": True}


# ---------- 매장 키 ----------


@router.get("/stores", dependencies=[Depends(require_admin)])
def stores(request: Request):
    with request.app.state.pool.connection() as conn:
        rows = conn.execute(
            "SELECT s.id, s.name, s.created_at, s.revoked_at, count(g.id)::int, max(g.updated_at) "
            "FROM app.store s LEFT JOIN app.game g ON g.store_id = s.id GROUP BY s.id ORDER BY s.id"
        ).fetchall()
    return {
        "stores": [
            {
                "id": i, "name": n, "created_at": c.isoformat(), "revoked_at": r.isoformat() if r else None,
                "games": cnt, "last_upload_at": last.isoformat() if last else None,
            }
            for i, n, c, r, cnt, last in rows
        ]
    }


@router.post("/stores", dependencies=[Depends(require_admin_write)])
def create_store(request: Request, name: str = Body(..., embed=True, min_length=1, max_length=100)):
    name = name.strip()
    if not name:
        raise HTTPException(422, "매장 이름이 비었습니다")
    key = new_store_key()
    with request.app.state.pool.connection() as conn:
        sid, created = conn.execute(
            "INSERT INTO app.store (name, key_hash) VALUES (%s, %s) RETURNING id, created_at", (name, store_key_hash(key))
        ).fetchone()
    # 평문 키는 이 응답에 한 번만 나온다.
    return {"id": sid, "name": name, "key": key, "created_at": created.isoformat()}


@router.post("/stores/{store_id}/revoke", dependencies=[Depends(require_admin_write)])
def revoke_store(request: Request, store_id: int):
    with request.app.state.pool.connection() as conn:
        row = conn.execute(
            "UPDATE app.store SET revoked_at = coalesce(revoked_at, now()) WHERE id = %s RETURNING revoked_at", (store_id,)
        ).fetchone()
    if row is None:
        raise HTTPException(404, "매장이 없습니다")
    return {"id": store_id, "revoked_at": row[0].isoformat()}


# ---------- 대국 숨기기 ----------


@router.get("/games", dependencies=[Depends(require_admin)])
def admin_games(request: Request, page: int = Query(1, ge=1, le=100000)):
    with request.app.state.pool.connection() as conn:
        total = conn.execute("SELECT count(*) FROM app.game").fetchone()[0]
        rows = conn.execute(
            "SELECT g.id, g.started_at, g.hidden, s.name, g.client_game_id, "
            "(SELECT string_agg(p.name, ' · ' ORDER BY p.seat) FROM app.game_player p WHERE p.game_id = g.id) "
            "FROM app.game g JOIN app.store s ON s.id = g.store_id "
            "ORDER BY g.started_at DESC, g.id DESC LIMIT %s OFFSET %s",
            (PAGE_SIZE, (page - 1) * PAGE_SIZE),
        ).fetchall()
    return {
        "page": page,
        "page_size": PAGE_SIZE,
        "total": total,
        "items": [
            {"id": i, "started_at": st.isoformat(), "hidden": h, "store": sn, "client_game_id": cg, "players": pl or ""}
            for i, st, h, sn, cg, pl in rows
        ],
    }


def _set_hidden(request: Request, game_id: int, hidden: bool):
    with request.app.state.pool.connection() as conn:
        row = conn.execute("UPDATE app.game SET hidden = %s WHERE id = %s RETURNING id", (hidden, game_id)).fetchone()
    if row is None:
        raise HTTPException(404, "대국이 없습니다")
    return {"id": game_id, "hidden": hidden}


@router.post("/games/{game_id}/hide", dependencies=[Depends(require_admin_write)])
def hide(request: Request, game_id: int):
    return _set_hidden(request, game_id, True)


@router.post("/games/{game_id}/unhide", dependencies=[Depends(require_admin_write)])
def unhide(request: Request, game_id: int):
    return _set_hidden(request, game_id, False)
