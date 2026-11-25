import type { ReactNode } from 'react'
import { fmtDateTime, fmtPoints, fmtScore, scoreClass } from '../format'
import { Link, gamePath, memberPath } from '../router'
import type { GameSummary } from '../types'

export function Status({ loading, error, onRetry }: { loading?: boolean; error?: string | null; onRetry?: () => void }) {
  if (error)
    return (
      <div className="status error" role="alert">
        {error}
        {onRetry && (
          <button className="btn small" onClick={onRetry}>
            다시 시도
          </button>
        )}
      </div>
    )
  if (loading) return <div className="status">불러오는 중…</div>
  return null
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="status empty">{children}</div>
}

export function RankBadge({ rank }: { rank: number }) {
  return <span className={`rank-badge r${rank}`}>{rank}</span>
}

/** 다른 사이트에서 가져온 대국의 출처 표시. */
export const SOURCE_NAME: Record<string, string> = { mavely: '마블리' }

/** 대국 한 줄: 날짜 + 네 사람(순위 순) 최종 점수 · 정산. */
export function GameCard({ g, highlight }: { g: GameSummary; highlight?: string }) {
  const players = g.players.slice().sort((a, b) => a.rank - b.rank)
  return (
    <Link to={gamePath(g.id)} className="game-card">
      <div className="gc-head">
        <span className="gc-date">{fmtDateTime(g.started_at)}</span>
        <span className="gc-tags">
          {g.east_only && <span className="tag">동풍</span>}
          {g.source ? (
            <span className="tag muted">{SOURCE_NAME[g.source] ?? g.source}</span>
          ) : (
            g.manual && <span className="tag muted">직접 입력</span>
          )}
          {g.paifu_count > 0 && <span className="tag accent">패보 {g.paifu_count}</span>}
        </span>
      </div>
      <ol className="gc-players">
        {players.map((p) => (
          <li key={p.seat} className={p.name === highlight ? 'me' : ''}>
            <RankBadge rank={p.rank} />
            <span className="gc-name">{p.name}</span>
            <span className={`gc-pts ${p.bust ? 'neg' : ''}`}>{fmtPoints(p.final_points)}</span>
            <span className={`gc-score ${scoreClass(p.score)}`}>{fmtScore(p.score)}</span>
          </li>
        ))}
      </ol>
    </Link>
  )
}

export function MemberLink({ name }: { name: string }) {
  return (
    <Link to={memberPath(name)} className="member-link">
      {name}
    </Link>
  )
}

export function Pager({ page, total, size, onPage }: { page: number; total: number; size: number; onPage: (p: number) => void }) {
  const last = Math.max(1, Math.ceil(total / size))
  if (last <= 1) return null
  return (
    <nav className="pager" aria-label="쪽 넘기기">
      <button className="btn small" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        이전
      </button>
      <span>
        {page} / {last}
      </span>
      <button className="btn small" disabled={page >= last} onClick={() => onPage(page + 1)}>
        다음
      </button>
    </nav>
  )
}
