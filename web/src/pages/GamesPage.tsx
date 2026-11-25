import { useApi } from '../api'
import { Empty, GameCard, Pager, Status } from '../components/common'
import { Link, navigate, type Route } from '../router'
import type { GameSummary, Page } from '../types'

export function GamesPage({ route }: { route: Route }) {
  const member = route.query.get('member') || undefined
  const page = Math.max(1, Number(route.query.get('page')) || 1)
  const d = useApi<Page<GameSummary>>('/v1/games', { member, page })

  const go = (p: number) => {
    const q = new URLSearchParams()
    if (member) q.set('member', member)
    if (p > 1) q.set('page', String(p))
    const s = q.toString()
    navigate(`games${s ? `?${s}` : ''}`)
  }

  return (
    <>
      <div className="page-head">
        <h1>대국 목록</h1>
        {member && (
          <p className="filter">
            <b>{member}</b> 의 대국 · <Link to="games">전체 보기</Link>
          </p>
        )}
      </div>
      <Status loading={d.loading} error={d.error} onRetry={d.reload} />
      {d.data && d.data.items.length === 0 && <Empty>올라온 대국이 없습니다.</Empty>}
      {d.data && d.data.items.length > 0 && (
        <>
          <p className="hint">모두 {d.data.total}국 · 최신순</p>
          <div className="game-list">
            {d.data.items.map((g) => (
              <GameCard key={g.id} g={g} highlight={member} />
            ))}
          </div>
          <Pager page={page} total={d.data.total} size={d.data.page_size} onPage={go} />
        </>
      )}
    </>
  )
}
