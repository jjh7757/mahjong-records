# mahjong-records

마작 점수 계산기(태블릿 앱)가 끝난 대국을 올리고, 휴대폰으로 순위표 · 대국 · 패보를 보는 기록 사이트.
설계: 앱 저장소 `docs/records_site_design_1125.md`.

- 서버: Python 3.12 · FastAPI · psycopg 3(풀 최대 3) · Postgres(schema `app`)
- 웹: React + Vite + TypeScript(`web/`), 서버가 `/records/` 에서 빌드 결과를 내보냄
- 모든 경로는 `/records` 아래. 운영: `https://mahjong.ai-agent-develop.cloud/records/`

## API

| 방법 · 경로 | 인증 | 내용 |
| --- | --- | --- |
| `POST /records/api/v1/games` | `X-Store-Key` | 대국 올리기(멱등 upsert, `created` · `updated` · `unchanged`). 본문 2MB 상한 |
| `GET /records/api/v1/members?from=&to=` | 없음 | 멤버 순위(앱 `memberStats` 와 같은 규칙) |
| `GET /records/api/v1/members/{name}` | 없음 | 멤버 성적 + 최근 대국 50 + 순위 흐름 20 |
| `GET /records/api/v1/games?member=&page=` | 없음 | 대국 목록(최신순, 20개씩, 숨긴 대국 제외) |
| `GET /records/api/v1/games/{id}` | 없음 | 정산 · 국별 사건 · 패보(`frames` · `restore` 칸은 빼고) |
| `GET /records/api/v1/overview` | 없음 | 총 대국 · 월별 · 화료/유국 |
| `POST /records/api/admin/login` · `logout`, `GET /me` | 비밀번호 | 서명 쿠키(HttpOnly · Secure · SameSite=Strict · 12시간), 5번 틀리면 15분 잠금 |
| `GET/POST /records/api/admin/stores`, `POST …/stores/{id}/revoke` | 관리자 | 매장 키 발급(평문은 응답에 한 번) · 폐기 |
| `GET /records/api/admin/games`, `POST …/games/{id}/hide` · `unhide` | 관리자 | 숨기기(지우지 않음) |
| `GET /records/healthz` | 없음 | DB 연결 확인 |

관리자 쓰기 요청은 `X-Requested-With` 머리글이 있어야 한다. 모든 응답에 `X-Robots-Tag: noindex`.

### 업로드 본문

```json
{"game": Game.toJson(),
 "settlement": [{"seat": 0, "name": "…", "rank": 1, "points": 45000, "score": 55.0, "stars": 2}, …4개],
 "paifu": [Paifu.toJson(), …],
 "app_version": "1.2.3+45"}
```

정산은 앱이 계산해 보낸다(`Game.settle()`). 서버는 자리 0~3 · 순위 1~4 를 한 번씩, 이름이 비지 않았는지와 저장에 쓰는 칸의 꼴만 본다.
`game.startedAt` 이 시간대 없는 지역 시각이면 `APP_TIMEZONE`(기본 Asia/Seoul)으로 읽는다.
같은 매장 키 · 같은 `game.id` 는 한 대국이다. 내용 해시(키 정렬한 JSON 의 sha256)가 같으면 `unchanged`, 다르면 하위 행을 지우고 다시 쓴다(`updated`, 대국 번호 · 숨김은 그대로).

## 환경변수

| 이름 | 뜻 |
| --- | --- |
| `DATABASE_URL` | 필수. `postgresql://user:pw@host:5432/db`. 시작할 때 `migrations/NNN_*.sql` 을 순서대로 적용(`app.schema_migrations`) |
| `ADMIN_PASSWORD_HASH` | `python scripts/hash_password.py` 의 출력(`scrypt:…`). 없으면 관리자 기능 꺼짐 |
| `SESSION_SECRET` | 쿠키 서명 키(48자 이상 무작위). 없으면 관리자 기능 꺼짐 |
| `COOKIE_SECURE` | 기본 `true`. 로컬 http 로 관리자 화면을 볼 때만 `false` |
| `APP_TIMEZONE` | 기본 `Asia/Seoul` |
| `GIT_SHA` | 이미지 빌드 때 넣음(`/healthz` 에 나옴) |

## 로컬 실행

```bash
# DB
docker run -d --rm --name mjrec-dev -e POSTGRES_PASSWORD=x -p 55433:5432 postgres:16-alpine

# 서버
python -m venv .venv && .venv/Scripts/pip install -r requirements-dev.txt   # (Linux/mac: .venv/bin/…)
export DATABASE_URL=postgresql://postgres:x@localhost:55433/postgres
export ADMIN_PASSWORD_HASH="$(.venv/Scripts/python scripts/hash_password.py)"
export SESSION_SECRET="$(python -c 'import secrets; print(secrets.token_urlsafe(48))')"
export COOKIE_SECURE=false
(cd web && npm ci && npm run build)
.venv/Scripts/python -m uvicorn --factory app.main:create_app --port 8000
# → http://localhost:8000/records/

# 웹만 고칠 때: (cd web && npm run dev) → http://localhost:5173/records/ (API 는 8000 으로 넘김)
```

한 바퀴 확인(관리자 로그인 → 시험 매장 키 → 패보 넣은 가짜 대국 셋 → GET API → 정적 파일):

```bash
.venv/Scripts/python scripts/smoke.py http://localhost:8000 --paifu-dir ../mahjong_calc/assets/paifu
```

## 시험

```bash
docker run -d --rm --name mjrec-test -e POSTGRES_PASSWORD=x -p 55433:5432 postgres:16-alpine
.venv/Scripts/python -m pytest          # TEST_DATABASE_URL 기본 postgresql://postgres:x@localhost:55433/postgres
(cd web && npm run build)               # tsc --noEmit + vite build
docker rm -f mjrec-test
```

시험은 `app` schema 를 지우고 다시 만든다. **운영 DB 에 대고 돌리지 말 것.**
CI(`.github/workflows/deploy.yml` 의 test)는 `services: postgres:16-alpine` 로 같은 시험을 돌리고, 통과해야 배포한다.

## 매장 키 발급

1. `/records/admin` 에서 관리자 로그인.
2. "매장 키" 에 이름(예: `본점 태블릿`)을 넣고 "키 발급". 키는 그 화면에서 **한 번만** 보인다(DB 에는 sha256 만).
3. 태블릿 앱 설정 "기록 사이트" 칸에 키를 넣는다.
4. 태블릿을 잃어버리거나 키가 새면 같은 화면에서 "폐기" → 새 키 발급. 폐기한 키의 업로드는 401.

curl 로 할 때(쿠키 · `X-Requested-With` 필요):

```bash
curl -c jar -H 'X-Requested-With: x' -H 'Content-Type: application/json' \
  -d '{"password":"…"}' https://mahjong.ai-agent-develop.cloud/records/api/admin/login
curl -b jar -H 'X-Requested-With: x' -H 'Content-Type: application/json' \
  -d '{"name":"본점 태블릿"}' https://mahjong.ai-agent-develop.cloud/records/api/admin/stores
```

## 배포(처음 한 번, 사람이 확인하며)

1. GitHub 공개 저장소 `jjh7757/mahjong-records` 를 만들고 push(ARM 러너 무료 조건).
2. ECR 리포지토리 `mahjong-records`(Mutable, 이미지 10개 수명 주기).
3. ★ IAM 역할 `github-actions-deploy` 신뢰 정책에 `repo:jjh7757/mahjong-records:ref:refs/heads/master` 한 줄 추가.
4. 서버 `/srv/mahjong-records/`:
   - `deploy/docker-compose.yml` 을 `docker-compose.yml` 로 복사(메모리 256M, healthcheck `/records/healthz`, `web` 네트워크).
   - `.env`(권한 600): `deploy/env.example` 꼴로 `DATABASE_URL`(= `/srv/db/.env.mahjong` 의 database `mahjong` · role `mahjong`), `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`.
   - role `mahjong` 이 database `mahjong` 에 schema 를 만들 수 있어야 한다(첫 시작 때 `CREATE SCHEMA IF NOT EXISTS app`). 안 되면 관리자 role 로 `CREATE SCHEMA app AUTHORIZATION mahjong;` 을 먼저.
5. Caddy: `deploy/Caddyfile.snippet` 의 `handle /records* { reverse_proxy mahjong-records:8000 }` 를 `mahjong.ai-agent-develop.cloud` 블록 안 판독 서버 처리보다 앞에 넣고 `caddy validate` → reload.
6. master push → Actions(test → 빌드 · ECR · SSM `deploy-app mahjong-records <sha>`).
7. 확인: `curl https://mahjong.ai-agent-develop.cloud/records/healthz` 의 `git_sha`,
   `python scripts/smoke.py https://mahjong.ai-agent-develop.cloud --paifu-dir … --cleanup`(시험 대국을 올리고 숨김 · 시험 키 폐기).
8. TIL `환경정보.md` · `monitor.sh` 에 앱 추가.

## 알려진 한계

- 관리자 로그인 잠금은 전역(관리자 한 명)이라, 누가 일부러 틀리면 관리자도 15분 못 들어간다.
- `robots.txt` 는 `/records/robots.txt` 에 있다. 도메인 루트(`/robots.txt`)는 판독 서버 몫이라 색인 막기는 `X-Robots-Tag` · `<meta name=robots>` 가 맡는다.
- 정산 · 별은 앱 값을 그대로 믿는다(서버에서 다시 계산하지 않음).
