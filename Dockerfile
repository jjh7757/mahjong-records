# 1) 프론트 빌드(node). 빌드 기계 아키텍처에서 돌려도 결과(정적 파일)는 같다.
FROM --platform=$BUILDPLATFORM node:24-slim AS web
WORKDIR /web
COPY web/package.json web/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY web/ ./
RUN npm run build

# 2) 서버. 기반 이미지는 판독 서버(mahjong-recognizer)와 같은 digest(2026-10-30 python:3.12-slim, multi-arch 목록).
FROM python:3.12-slim@sha256:aa943ce411423c7582288f18707ff66eddcbaeb510502d747a72aeb34f30d159

WORKDIR /srv/app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

# wget: 서버 compose 의 healthcheck 가 쓴다. app: 서버를 돌리는 비루트 사용자(쓰는 파일 없음).
RUN apt-get update && apt-get install -y --no-install-recommends wget \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --no-create-home --shell /usr/sbin/nologin app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY migrations ./migrations
COPY --from=web /web/dist ./web/dist

ARG GIT_SHA=unknown
ENV GIT_SHA=$GIT_SHA

USER app
EXPOSE 8000
CMD ["uvicorn", "--factory", "app.main:create_app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
