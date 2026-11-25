#!/usr/bin/env bash
# 앱(mahjong_calc)의 순수 Dart 점수 계산 · 패보 복기 엔진을 JS 하나로 묶어 web/public/engine/ 에 둔다.
#
#   scripts/build_engine.sh            # 묶고 22판 대조(Dart VM ↔ JS)까지
#   scripts/build_engine.sh --no-check # 묶기만
#
# 앱 저장소 경로: APP_DIR(기본 ../mahjong_calc). dart 는 PATH 또는 DART(기본: PATH 의 dart, 없으면 ~/flutter/bin/dart).
# 산출 mj_engine.js 와 ENGINE_SOURCE.txt 는 이 저장소에 커밋한다(사이트 CI · Docker 빌드에는 Dart 가 없다).
# -O2: 엔진은 잘못된 기록을 try/catch(ArgumentError · FormatException 등)로 거르므로, 오류 검사를 빼는 -O3 · -O4 는 쓰지 않는다.
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="${APP_DIR:-$HERE/../mahjong_calc}"
APP_DIR="$(cd "$APP_DIR" && pwd)"
OUT_DIR="$HERE/web/public/engine"
CHECK=1
[ "${1:-}" = "--no-check" ] && CHECK=0

DART="${DART:-}"
if [ -z "$DART" ]; then
  if command -v dart >/dev/null 2>&1; then DART=dart
  elif [ -x "$HOME/flutter/bin/dart" ]; then DART="$HOME/flutter/bin/dart"
  elif [ -x "$HOME/flutter/bin/dart.bat" ]; then DART="$HOME/flutter/bin/dart.bat"
  else echo "dart 를 찾지 못했습니다(DART=… 로 지정)" >&2; exit 1
  fi
fi

ENTRY="tool/web_engine/web_engine.dart"
[ -f "$APP_DIR/$ENTRY" ] || { echo "$APP_DIR/$ENTRY 가 없습니다" >&2; exit 1; }

SHA="$(git -C "$APP_DIR" rev-parse HEAD)"
SHORT="$(git -C "$APP_DIR" rev-parse --short HEAD)"
BRANCH="$(git -C "$APP_DIR" rev-parse --abbrev-ref HEAD)"
if [ -z "$(git -C "$APP_DIR" status --porcelain)" ]; then CLEAN=yes; else CLEAN=no; fi
BUILT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

mkdir -p "$OUT_DIR"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

(cd "$APP_DIR" && "$DART" compile js -O2 \
  -DENGINE_SHA="$SHORT" \
  "$ENTRY" -o "$TMP/mj_engine.js")
# 윈도에서 dart2js 가 CRLF 로 쓴다 — 저장소는 LF(.gitattributes), 해시도 LF 본으로.
sed 's/\r$//' "$TMP/mj_engine.js" > "$OUT_DIR/mj_engine.js"
# 묶음에 실제로 들어간 앱 파일(dart2js 의 .deps)만의 깨끗함 — 다른 파일의 변경은 결과에 영향 없음.
DEPS="$(tr ' ' '\n' < "$TMP/mj_engine.js.deps" | grep -oE 'mahjong_calc/(lib|tool/web_engine)/[^ ]*\.dart$' | sed 's#^mahjong_calc/##' | sort -u)"
ENGINE_CHANGES="$(cd "$APP_DIR" && git status --porcelain -- $DEPS tool/web_engine)"

{
  echo "원본: $APP_DIR/$ENTRY (앱 저장소 jjh7757/mahjong_calc)"
  echo "앱 저장소 HEAD: $SHA ($BRANCH)"
  echo "작업 트리 깨끗함: $CLEAN"
  if [ -z "$(git -C "$APP_DIR" ls-files -- tool/web_engine)" ]; then
    echo "주의: tool/web_engine 은 커밋 전 — HEAD 에는 진입점이 없다(아래 목록의 ?? 파일)."
  fi
  echo "묶음에 든 앱 파일($(echo "$DEPS" | wc -l)개): $(echo $DEPS)"
  if [ -n "$ENGINE_CHANGES" ]; then
    echo "그중 커밋 안 된 변경(tool/web_engine 포함):"
    echo "$ENGINE_CHANGES" | sed 's/^/  /'
  else
    echo "그중 커밋 안 된 변경: 없음"
  fi
  echo "만든 때(UTC): $BUILT"
  echo "명령: dart compile js -O2 -DENGINE_SHA=$SHORT $ENTRY"
  echo "dart: $("$DART" --version 2>&1 | head -1)"
  echo "크기: $(wc -c < "$OUT_DIR/mj_engine.js") 바이트"
  echo "룰: RuleSet.standard(쿠이탄 있음 · 끌어올림 만관 없음 · 헤아림 역만 있음 · 더블 역만 있음 · 연풍패 머리 4부 · 적도라 있음)"
} > "$OUT_DIR/ENGINE_SOURCE.txt"

# 웹이 ?v= 로 붙여 캐시를 가르는 내용 해시(public/ 파일은 해시 이름이 아니다).
HASH="$(sha256sum "$OUT_DIR/mj_engine.js" | cut -c1-12)"
cat > "$HERE/web/src/engineBuild.ts" <<EOF
// scripts/build_engine.sh 가 만든다 — 손으로 고치지 말 것.
/** public/engine/mj_engine.js 내용 해시(앞 12자). */
export const ENGINE_HASH = '$HASH'
/** 앱 저장소 HEAD(짧은 sha). 작업 트리 상태는 public/engine/ENGINE_SOURCE.txt. */
export const ENGINE_APP_SHA = '$SHORT'
EOF

if [ "$CHECK" = 1 ]; then
  FILES=()
  for f in "$APP_DIR"/assets/paifu/*.json "$APP_DIR"/assets/paifu_h3/*.json; do [ -f "$f" ] && FILES+=("$f"); done
  (cd "$APP_DIR" && "$DART" run tool/web_engine/compare_vm.dart "$TMP/vm.jsonl" "${FILES[@]}")
  node "$APP_DIR/tool/web_engine/compare_js.mjs" "$OUT_DIR/mj_engine.js" "$TMP/js.jsonl" "${FILES[@]}"
  node "$APP_DIR/tool/web_engine/compare.mjs" "$TMP/vm.jsonl" "$TMP/js.jsonl" | tee "$TMP/compare.txt"
  echo "대조: $(tail -1 "$TMP/compare.txt")" >> "$OUT_DIR/ENGINE_SOURCE.txt"
fi

cat "$OUT_DIR/ENGINE_SOURCE.txt"
