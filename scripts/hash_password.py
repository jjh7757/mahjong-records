"""관리자 비밀번호 해시를 만든다. 나온 한 줄을 서버 .env 의 ADMIN_PASSWORD_HASH 로 넣는다.

    python scripts/hash_password.py            # 비밀번호를 두 번 묻는다(화면에 안 보임)

형식은 `scrypt:<n>:<r>:<p>:<salt>:<hash>` — `$` 가 없어 compose .env 에 그대로 붙여도 된다.
"""
from __future__ import annotations

import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.security import hash_password  # noqa: E402


def main() -> int:
    pw = getpass.getpass("관리자 비밀번호: ")
    if len(pw) < 12:
        print("12자 이상으로 정하세요.", file=sys.stderr)
        return 1
    if getpass.getpass("한 번 더: ") != pw:
        print("두 번 입력이 다릅니다.", file=sys.stderr)
        return 1
    h = hash_password(pw)
    print(h)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
