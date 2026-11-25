"""매장 키 · 관리자 비밀번호 · 세션 쿠키.

- 매장 키: 32바이트 무작위(token_urlsafe). DB 에는 sha256(hex)만 둔다.
- 관리자 비밀번호: hashlib.scrypt. 형식 ``scrypt:<n>:<r>:<p>:<salt b64>:<hash b64>`` (`$` 를 쓰지 않아 compose .env 에서 그대로 쓸 수 있다) (scripts/hash_password.py 가 만든다).
- 세션 쿠키: ``<payload b64>.<HMAC-SHA256 b64>``, payload = {"exp": 끝 시각(epoch 초), "ep": 세션 세대, "n": 무작위}.
  로그아웃하면 DB 의 세션 세대를 올려 그 전 쿠키를 모두 무효로 한다.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import time

SCRYPT_N = 2**15
SCRYPT_R = 8
SCRYPT_P = 1
_SCRYPT_MAXMEM = 64 * 1024 * 1024

SESSION_COOKIE = "mjrec_admin"
SESSION_SECONDS = 12 * 3600


def new_store_key() -> str:
    return secrets.token_urlsafe(32)


def store_key_hash(key: str) -> str:
    return hashlib.sha256(key.encode("utf-8")).hexdigest()


def _b64e(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode("ascii")


def _b64d(s: str) -> bytes:
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def hash_password(password: str, *, n: int = SCRYPT_N, r: int = SCRYPT_R, p: int = SCRYPT_P) -> str:
    salt = secrets.token_bytes(16)
    dk = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=n, r=r, p=p, maxmem=_SCRYPT_MAXMEM, dklen=32)
    return f"scrypt:{n}:{r}:{p}:{_b64e(salt)}:{_b64e(dk)}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algo, n, r, p, salt, want = stored.strip().split(":")
        if algo != "scrypt":
            return False
        dk = hashlib.scrypt(
            password.encode("utf-8"),
            salt=_b64d(salt),
            n=int(n),
            r=int(r),
            p=int(p),
            maxmem=_SCRYPT_MAXMEM,
            dklen=len(_b64d(want)),
        )
    except (ValueError, TypeError):
        return False
    return hmac.compare_digest(dk, _b64d(want))


def sign_session(secret: str, epoch: int, *, now: float | None = None) -> str:
    payload = {"exp": int((now or time.time()) + SESSION_SECONDS), "ep": epoch, "n": secrets.token_hex(8)}
    body = _b64e(json.dumps(payload, separators=(",", ":")).encode())
    sig = _b64e(hmac.new(secret.encode(), body.encode(), hashlib.sha256).digest())
    return f"{body}.{sig}"


def read_session(secret: str, token: str | None, *, now: float | None = None) -> dict | None:
    """서명 · 만료가 맞으면 payload, 아니면 None. 세션 세대 비교는 부르는 쪽이 한다."""
    if not secret or not token or token.count(".") != 1:
        return None
    body, sig = token.split(".")
    want = _b64e(hmac.new(secret.encode(), body.encode(), hashlib.sha256).digest())
    if not hmac.compare_digest(sig, want):
        return None
    try:
        payload = json.loads(_b64d(body))
    except (ValueError, json.JSONDecodeError):
        return None
    if not isinstance(payload, dict) or not isinstance(payload.get("exp"), int):
        return None
    if payload["exp"] < (now or time.time()):
        return None
    return payload
