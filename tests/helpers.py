"""앱 Game.toJson() · Game.settle() 꼴의 시험 자료를 만든다(lib/game/game.dart 를 옮긴 것, 시험 전용)."""
from __future__ import annotations

import json
from pathlib import Path

DEFAULT_SETTINGS = {
    "startPoints": 25000,
    "returnPoints": 30000,
    "umaBig": 20,
    "umaSmall": 10,
    "eastOnly": False,
    "roundingMode": 1,
    "bottomSeat": 0,
    "multiRon": 0,
    "agariYame": True,
    "tenpaiYame": True,
    "overtime": True,
}

PAIFU_DIR = Path(__file__).resolve().parent / "fixtures" / "paifu"


def _thousands(points: int, rounding_mode: int) -> float:
    if rounding_mode == 1:  # 오사육입: 500 이하 버림, 600 이상 올림
        sign = -1 if points < 0 else 1
        q, r = divmod(abs(points), 1000)
        return float(sign * (q + 1 if r >= 600 else q))
    v = points / 1000 * 10
    # Dart double.round(): 0.5 는 0 에서 먼 쪽
    rounded = int(v + 0.5) if v >= 0 else -int(-v + 0.5)
    return rounded / 10


def settle(names, scores, settings=DEFAULT_SETTINGS, stars=(0, 0, 0, 0)):
    order = sorted(range(4), key=lambda s: (-scores[s], s))  # 동점은 기동 자리 순
    uma = [settings["umaBig"], settings["umaSmall"], -settings["umaSmall"], -settings["umaBig"]]
    oka = (settings["returnPoints"] - settings["startPoints"]) * 4 // 1000
    out = []
    for rank, seat in enumerate(order):
        base = _thousands(scores[seat] - settings["returnPoints"], settings["roundingMode"]) + uma[rank]
        if rank == 0:
            base += oka
        out.append({
            "seat": seat, "name": names[seat], "rank": rank + 1, "points": scores[seat],
            "score": round(base, 1), "stars": stars[seat],
        })
    return out


def game_json(gid, started, names, scores, *, settings=None, stars=(0, 0, 0, 0), ended_by="종료"):
    settings = dict(DEFAULT_SETTINGS, **(settings or {}))
    start = settings["startPoints"]
    delta = [s - start for s in scores]
    events = [
        {"kind": "riichi", "description": f"{names[0]} 리치", "delta": [0, 0, 0, 0], "round": "동1국"},
        {"kind": "win", "description": "몰아서 한 화료", "delta": delta, "round": "동1국", "stars": list(stars)},
        {"kind": "draw", "description": "유국 (텐파이: 전원 노텐)", "delta": [0, 0, 0, 0], "round": "동2국 1본장"},
        {"kind": "end", "description": f"{ended_by} — 1위", "delta": [0, 0, 0, 0], "round": "남4국"},
    ]
    return {
        "id": gid,
        "startedAt": started,
        "settings": settings,
        "names": list(names),
        "scores": list(scores),
        "roundWind": 1,
        "roundNumber": 4,
        "honba": 0,
        "riichiSticks": 0,
        "dealer": 3,
        "riichiSeats": [],
        "carriedStickSeats": [],
        "events": events,
        "checkpoints": [],
        "finished": True,
        "endedBy": ended_by,
    }


def load_paifu(name: str) -> dict:
    return json.loads((PAIFU_DIR / name).read_text(encoding="utf-8"))


def payload(gid, started, names, scores, *, settings=None, stars=(0, 0, 0, 0), paifu=(), app_version="1.0.0+test"):
    g = game_json(gid, started, names, scores, settings=settings, stars=stars)
    return {
        "game": g,
        "settlement": settle(names, scores, g["settings"], stars),
        "paifu": list(paifu),
        "app_version": app_version,
    }
