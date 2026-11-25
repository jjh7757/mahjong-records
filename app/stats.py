"""멤버 집계. 앱 lib/game/member_stats.dart(memberStats)와 같은 규칙.

- 정산 합 = Settlement.score 합, 소수 한 자리(앱은 더할 때마다 반올림 — 점수가 이미 소수 한 자리라 정확한 합과 같다).
- 토비 = 최종 점수 < 0, 최고 = 최종 점수 최대, 별 = Settlement.stars 합.
- 정렬: 정산 합 내림차순 → 평균 순위 오름차순 → 이름.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from decimal import ROUND_HALF_UP, Decimal
from typing import Iterable


@dataclass
class MemberStat:
    name: str
    games: int = 0
    total: Decimal = Decimal("0.0")
    rank_counts: list[int] = field(default_factory=lambda: [0, 0, 0, 0])
    busts: int = 0
    stars: int = 0
    best: int | None = None

    @property
    def avg_rank(self) -> float:
        if self.games == 0:
            return 0.0
        return sum((r + 1) * c for r, c in enumerate(self.rank_counts)) / self.games

    def rate(self, *ranks: int) -> float:
        return 0.0 if self.games == 0 else sum(self.rank_counts[r - 1] for r in ranks) / self.games

    def to_json(self) -> dict:
        return {
            "name": self.name,
            "games": self.games,
            "total": float(self.total.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)),
            "avg_rank": round(self.avg_rank, 4),
            "rank_counts": self.rank_counts,
            "top_rate": round(self.rate(1), 4),
            "top2_rate": round(self.rate(1, 2), 4),
            "last_rate": round(self.rate(4), 4),
            "busts": self.busts,
            "stars": self.stars,
            "avg_stars": round(self.stars / self.games, 4) if self.games else 0.0,
            "best": self.best,
        }


def member_stats(rows: Iterable[tuple[str, int, int, Decimal, int]]) -> list[MemberStat]:
    """rows: (name, rank, final_points, score, stars) — 대국 한 판의 한 자리씩."""
    by: dict[str, MemberStat] = {}
    for name, rank, points, score, stars in rows:
        m = by.get(name)
        if m is None:
            m = by[name] = MemberStat(name)
        m.games += 1
        m.total += Decimal(score)
        m.rank_counts[rank - 1] += 1
        if points < 0:
            m.busts += 1
        m.stars += stars or 0
        if m.best is None or points > m.best:
            m.best = points
    out = list(by.values())
    # 앱과 같은 순서. 이름은 코드 단위 순(Dart String.compareTo 와 BMP 안에서 같다).
    out.sort(key=lambda m: (-m.total, m.avg_rank, m.name))
    return out
