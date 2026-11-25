"""띄운 서버에 대고 한 바퀴 돌려 본다(표준 라이브러리만).

    python scripts/smoke.py http://localhost:8000 --paifu-dir ../mahjong_calc/assets/paifu
    (관리자 비밀번호는 묻는다. 환경변수 SMOKE_ADMIN_PASSWORD 가 있으면 그것을 쓴다.)

1) 관리자 로그인 → 2) 매장 키 발급 → 3) 패보를 넣은 가짜 대국 셋 업로드(+ 같은 것 다시 → unchanged)
→ 4) 주요 GET API 확인 → 5) /records/ 의 HTML · JS 가 200 인지.
--cleanup 이면 끝에 올린 대국을 숨기고 키를 폐기한다(운영에서 배포 뒤 확인할 때).
"""
from __future__ import annotations

import argparse
import getpass
import http.cookiejar
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

NAMES = ["시험A", "시험B", "시험C", "시험D"]
SETTINGS = {
    "startPoints": 25000, "returnPoints": 30000, "umaBig": 20, "umaSmall": 10, "eastOnly": False,
    "roundingMode": 1, "bottomSeat": 0, "multiRon": 0, "agariYame": True, "tenpaiYame": True, "overtime": True,
}


class Client:
    def __init__(self, base: str):
        self.base = base.rstrip("/") + "/records"
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar))

    def req(self, method: str, path: str, body=None, headers=None):
        data = None if body is None else json.dumps(body, ensure_ascii=False).encode()
        h = {"Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", **(headers or {})}
        r = urllib.request.Request(self.base + path, data=data, method=method, headers=h)
        try:
            with self.opener.open(r, timeout=30) as resp:
                raw = resp.read()
                ctype = resp.headers.get("content-type", "")
                return resp.status, (json.loads(raw) if "json" in ctype else raw.decode("utf-8", "replace")), resp.headers
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode("utf-8", "replace"), e.headers


def thousands(points: int) -> float:  # 오사육입(roundingMode 1)
    sign = -1 if points < 0 else 1
    q, r = divmod(abs(points), 1000)
    return float(sign * (q + 1 if r >= 600 else q))


def settle(names, scores, stars):
    order = sorted(range(4), key=lambda s: (-scores[s], s))
    uma = [20, 10, -10, -20]
    out = []
    for rank, seat in enumerate(order):
        base = thousands(scores[seat] - 30000) + uma[rank] + (20 if rank == 0 else 0)
        out.append({"seat": seat, "name": names[seat], "rank": rank + 1, "points": scores[seat], "score": base, "stars": stars[seat]})
    return out


def fake_game(gid: str, started: str, paifus: list[dict], names: list[str]) -> dict:
    """패보의 국 결과로 사건을 만들고(론 8000 · 쯔모 2000/4000 몫 · 유국 0) 정산까지 붙인 업로드 본문."""
    scores = [25000] * 4
    events, stars = [], [0, 0, 0, 0]
    for p in paifus:
        label = p.get("round", "동1국") + (f" {p['honba']}본장" if p.get("honba") else "")
        r = p.get("result") or {}
        delta = [0, 0, 0, 0]
        if r.get("type") == "ron" and r.get("winner") is not None and r.get("loser") is not None:
            delta[r["winner"]] += 8000
            delta[r["loser"]] -= 8000
            kind, desc = "win", f"{names[r['winner']]} 론({names[r['loser']]}) 만관 8000"
        elif r.get("type") == "tsumo" and r.get("winner") is not None:
            w = r["winner"]
            for s in range(4):
                if s != w:
                    pay = 4000 if s == p.get("dealer", 0) else 2000
                    delta[s] -= pay
                    delta[w] += pay
            kind, desc = "win", f"{names[w]} 쯔모 만관"
        else:
            kind, desc = "draw", "유국 (텐파이: 전원 노텐)"
        for s in range(4):
            scores[s] += delta[s]
        events.append({"kind": kind, "description": desc, "delta": delta, "round": label,
                       **({"stars": [0, 0, 0, 0]} if kind == "win" else {})})
    events.append({"kind": "end", "description": "종료 — 시험 대국", "delta": [0, 0, 0, 0], "round": "남4국"})
    game = {
        "id": gid, "startedAt": started, "settings": SETTINGS, "names": names, "scores": scores,
        "roundWind": 1, "roundNumber": 4, "honba": 0, "riichiSticks": 0, "dealer": 3, "riichiSeats": [],
        "carriedStickSeats": [], "events": events, "checkpoints": [], "finished": True, "endedBy": "종료",
    }
    return {"game": game, "settlement": settle(names, scores, stars), "paifu": paifus, "app_version": "smoke"}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("base", help="예: http://localhost:8000")
    ap.add_argument("--paifu-dir", type=Path, required=True)
    ap.add_argument("--cleanup", action="store_true", help="끝에 올린 대국 숨기기 + 키 폐기")
    a = ap.parse_args()

    c = Client(a.base)
    ok = True

    def check(label, cond, extra=""):
        nonlocal ok
        ok &= bool(cond)
        print(f"[{'OK' if cond else '실패'}] {label}{(' — ' + extra) if extra else ''}")

    st, body, _ = c.req("GET", "/healthz")
    check("healthz", st == 200, json.dumps(body, ensure_ascii=False))

    pw = os.environ.get("SMOKE_ADMIN_PASSWORD") or getpass.getpass("관리자 비밀번호: ")
    st, body, _ = c.req("POST", "/api/admin/login", {"password": pw})
    check("관리자 로그인", st == 200, str(body)[:120])
    if st != 200:
        return 1
    st, store, _ = c.req("POST", "/api/admin/stores", {"name": "스모크 시험"})
    check("매장 키 발급", st == 200 and len(store.get("key", "")) >= 43, f"store id {store.get('id')}")
    key = store["key"]

    files = sorted(a.paifu_dir.glob("*.json"))
    paifu = [json.loads(f.read_text(encoding="utf-8")) for f in files]
    groups = [paifu[0:3], paifu[3:6], paifu[6:8]]
    names_rot = [NAMES, NAMES[1:] + NAMES[:1], NAMES[2:] + NAMES[:2]]
    uploaded = []
    for i, (grp, nm) in enumerate(zip(groups, names_rot)):
        body = fake_game(f"smoke-{i + 1}", f"2026-11-{14 + i:02d}T13:{10 + i:02d}:00.000", grp, nm)
        st, r, _ = c.req("POST", "/api/v1/games", body, {"X-Store-Key": key})
        check(f"업로드 {i + 1}(패보 {len(grp)})", st == 200 and r.get("status") in ("created", "updated", "unchanged"), str(r))
        if st == 200:
            uploaded.append(r["id"])
        if i == 0:
            st, r2, _ = c.req("POST", "/api/v1/games", body, {"X-Store-Key": key})
            check("같은 본문 다시 → unchanged", st == 200 and r2.get("status") == "unchanged", str(r2))
    st, r, _ = c.req("POST", "/api/v1/games", fake_game("x", "2026-11-14T13:00:00", paifu[:1], NAMES), {"X-Store-Key": "wrong"})
    check("틀린 키 → 401", st == 401)

    st, m, _ = c.req("GET", "/api/v1/members")
    check("members", st == 200 and len(m["members"]) >= 4,
          ", ".join(f"{x['name']} {x['total']:+.1f}/{x['games']}국" for x in m["members"][:6]))
    st, md, _ = c.req("GET", "/api/v1/members/" + urllib.request.quote(NAMES[0]))
    check("members/{name}", st == 200 and md["member"]["games"] >= 1, f"순위 흐름 {[f['rank'] for f in md['rank_flow']]}")
    st, gl, _ = c.req("GET", "/api/v1/games")
    check("games", st == 200 and gl["total"] >= len(uploaded), f"total {gl['total']}")
    if uploaded:
        st, gd, _ = c.req("GET", f"/api/v1/games/{uploaded[0]}")
        check("games/{id}", st == 200 and len(gd["paifu"]) == len(groups[0]),
              f"사건 {len(gd['events'])} · 패보 {[p['round'] for p in gd['paifu']]} · frames 뺌 {all('frames' not in p['raw'] for p in gd['paifu'])}")
    st, ov, _ = c.req("GET", "/api/v1/overview")
    check("overview", st == 200, json.dumps(ov, ensure_ascii=False)[:200])

    st, html, h = c.req("GET", "/")
    check("/records/ HTML", st == 200 and "<div id=\"root\">" in html, h.get("x-robots-tag", ""))
    m_js = re.search(r'src="(/records/assets/[^"]+\.js)"', html or "")
    if m_js:
        st, _, h = c.req("GET", m_js.group(1).removeprefix("/records"))
        check("JS 번들", st == 200, f"{m_js.group(1)} {h.get('content-type')}")
    st, html2, _ = c.req("GET", f"/games/{uploaded[0] if uploaded else 1}/paifu/0")
    check("SPA 대체 경로", st == 200 and "root" in html2)

    if a.cleanup:
        for gid in uploaded:
            c.req("POST", f"/api/admin/games/{gid}/hide")
        st, _, _ = c.req("POST", f"/api/admin/stores/{store['id']}/revoke")
        check("정리(숨기기 · 키 폐기)", st == 200)
    c.req("POST", "/api/admin/logout")
    print("모두 통과" if ok else "실패 있음")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
