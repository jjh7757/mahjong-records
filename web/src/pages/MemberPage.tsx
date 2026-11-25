import { useApi } from '../api'
import { RankBars, RankChart } from '../components/charts'
import { Empty, GameCard, Status } from '../components/common'
import { fmtPct, fmtPoints, fmtScore, scoreClass } from '../format'
import { Link } from '../router'
import type { GameSummary, Member } from '../types'

interface Detail {
  member: Member
  games: GameSummary[]
  rank_flow: { game_id: number; started_at: string; rank: number; score: number; final_points: number }[]
}

const md = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric' })

export function MemberPage({ name }: { name: string }) {
  const d = useApi<Detail>(`/v1/members/${encodeURIComponent(name)}`)
  const m = d.data?.member

  return (
    <>
      <div className="page-head">
        <Link to="" className="back">
          ← 순위표
        </Link>
        <h1>{name}</h1>
      </div>
      <Status loading={d.loading} error={d.error} onRetry={d.reload} />
      {m && d.data && (
        <>
          <section className="kpis">
            <Kpi label="정산 합" value={fmtScore(m.total)} cls={scoreClass(m.total)} big />
            <Kpi label="평균 순위" value={m.avg_rank.toFixed(2)} big />
            <Kpi label="대국" value={`${m.games}`} />
            <Kpi label="1위율" value={fmtPct(m.top_rate)} />
            <Kpi label="연대율" value={fmtPct(m.top2_rate)} />
            <Kpi label="4위율" value={fmtPct(m.last_rate)} />
            <Kpi label="토비" value={`${m.busts}`} />
            <Kpi label="별" value={`${m.stars}`} />
            <Kpi label="최고 점수" value={m.best === null ? '–' : fmtPoints(m.best)} />
          </section>

          <section className="card">
            <div className="card-head">
              <h2>순위 분포</h2>
            </div>
            <RankBars counts={m.rank_counts} />
          </section>

          {d.data.rank_flow.length > 1 && (
            <section className="card">
              <div className="card-head">
                <h2>최근 {d.data.rank_flow.length}국 순위 흐름</h2>
              </div>
              <RankChart
                ranks={d.data.rank_flow.map((f) => f.rank)}
                labels={d.data.rank_flow.map((f) => md.format(new Date(f.started_at)))}
              />
            </section>
          )}

          <section className="card">
            <div className="card-head">
              <h2>대국</h2>
              {m.games > d.data.games.length && (
                <Link to={`games?member=${encodeURIComponent(name)}`} className="more">
                  모두 보기 ({m.games})
                </Link>
              )}
            </div>
            {d.data.games.length === 0 ? (
              <Empty>대국이 없습니다.</Empty>
            ) : (
              <div className="game-list">
                {d.data.games.map((g) => (
                  <GameCard key={g.id} g={g} highlight={name} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}

function Kpi({ label, value, cls = '', big }: { label: string; value: string; cls?: string; big?: boolean }) {
  return (
    <div className={`kpi ${big ? 'big' : ''}`}>
      <span className="kpi-label">{label}</span>
      <span className={`kpi-value ${cls}`}>{value}</span>
    </div>
  )
}
