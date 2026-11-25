-- 대국 기록 사이트 첫 표(설계서 docs/records_site_design_1125.md 3절). schema app 은 시작 코드가 만든다.

CREATE TABLE app.store (
    id          serial PRIMARY KEY,
    name        text NOT NULL,
    key_hash    text NOT NULL UNIQUE,          -- 매장 키 sha256(hex). 평문은 저장하지 않는다
    created_at  timestamptz NOT NULL DEFAULT now(),
    revoked_at  timestamptz
);

CREATE TABLE app.game (
    id              bigserial PRIMARY KEY,
    store_id        int NOT NULL REFERENCES app.store(id),
    client_game_id  text NOT NULL,             -- 앱 Game.id
    started_at      timestamptz NOT NULL,
    finished        bool NOT NULL,
    ended_by        text,
    manual          bool NOT NULL,
    east_only       bool NOT NULL,
    settings        jsonb NOT NULL,
    raw             jsonb NOT NULL,            -- 앱 Game.toJson() 그대로
    payload_sha256  text NOT NULL,
    app_version     text,
    uploaded_at     timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    hidden          bool NOT NULL DEFAULT false,
    UNIQUE (store_id, client_game_id)
);
CREATE INDEX game_started_idx ON app.game (started_at DESC, id DESC);

CREATE TABLE app.game_player (
    game_id       bigint NOT NULL REFERENCES app.game(id) ON DELETE CASCADE,
    seat          int NOT NULL CHECK (seat BETWEEN 0 AND 3),
    name          text NOT NULL,
    final_points  int NOT NULL,
    rank          int NOT NULL CHECK (rank BETWEEN 1 AND 4),
    score         numeric(6,1) NOT NULL,
    stars         int NOT NULL DEFAULT 0,
    bust          bool NOT NULL,
    PRIMARY KEY (game_id, seat)
);
CREATE INDEX game_player_name_idx ON app.game_player (name);

CREATE TABLE app.game_event (
    game_id      bigint NOT NULL REFERENCES app.game(id) ON DELETE CASCADE,
    seq          int NOT NULL,
    kind         text NOT NULL,
    round_label  text NOT NULL,
    description  text NOT NULL,
    delta        int[] NOT NULL,
    stars        int[],
    PRIMARY KEY (game_id, seq)
);

CREATE TABLE app.paifu_round (
    game_id      bigint NOT NULL REFERENCES app.game(id) ON DELETE CASCADE,
    seq          int NOT NULL,
    paifu_id     text NOT NULL,
    round_name   text NOT NULL,
    honba        int NOT NULL,
    dealer       int NOT NULL,
    hero         int NOT NULL,
    result_type  text,
    winner       int,
    loser        int,
    raw          jsonb NOT NULL,
    PRIMARY KEY (game_id, seq)
);

-- 관리자 로그인 잠금 · 세션 세대(설계 3절에 없던 표 — 재시작해도 잠금이 풀리지 않게, 로그아웃이 쿠키를 무효로 하게).
CREATE TABLE app.admin_state (
    id             int PRIMARY KEY CHECK (id = 1),
    failures       int NOT NULL DEFAULT 0,
    locked_until   timestamptz,
    session_epoch  int NOT NULL DEFAULT 0
);
INSERT INTO app.admin_state (id) VALUES (1);
