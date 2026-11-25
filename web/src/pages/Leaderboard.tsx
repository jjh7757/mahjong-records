import { useApi } from '../api'
import { Empty, MemberLink, Status } from '../components/common'
import { fmtMonthDay, fmtPct, fmtScore, scoreClass, todayIso } from '../format'
import { navigate, type Route } from '../router'
import type { Member, Overview } from '../types'

type PeriodKey = 'all' | 'month' | 'lastmonth' | 'year' | 'custom'

function periodRange(key: PeriodKey, q: URLSearchParams): { from?: string; to?: string } {
  const today = todayIso()
  const [y, m] = today.split('-').map(Number)
  const pad = (n: number) => String(n).padStart(2, '0')
  const lastDay = (yy: number, mm: number) => new Date(Date.UTC(yy, mm, 0)).getUTCDate()
  switch (key) {
    case 'month':
      return { from: `${y}-${pad(m)}-01`, to: today }
    case 'lastmonth': {
      const ly = m === 1 ? y - 1 : y
      const lm = m === 1 ? 12 : m - 1
      return { from: `${ly}-${pad(lm)}-01`, to: `${ly}-${pad(lm)}-${pad(lastDay(ly, lm))}` }
    }
    case 'year':
      return { from: `${y}-01-01`, to: today }
    case 'custom':
      return { from: q.get('from') ?? undefined, to: q.get('to') ?? undefined }
    default:
      return {}
  }
}

const PERIODS: [PeriodKey, string][] = [
  ['all', '전체'],
  ['month', '이번 달'],
  ['lastmonth', '지난 달'],
  ['year', '올해'],
  ['custom', '직접'],
]

export function Leaderboard({ route }: { route: Route }) {
  const key = (route.query.get('p') as PeriodKey) || 'all'
  const range = periodRange(key, route.query)
  const members = useApi<{ members: Member[] }>('/v1/members', range)
  const overview = useApi<Overview>('/v1/overview')

  const setPeriod = (k: PeriodKey, extra: Record<string, string> = {}) => {
    const q = new URLSearchParams({ ...(k === 'all' ? {} : { p: k }), ...extra })
    if (k === 'custom' && !extra.from) {
      const r = periodRange('month', q)
      q.set('from', r.from!)
      q.set('to', r.to!)
    }
    const s = q.toString()
    navigate(s ? `?${s}` : '', { replace: true })
  }

  const ov = overview.data
  const list = members.data?.members ?? []

  return (
    <>
      {ov && (
        <section className="stat-strip" aria-label="요약">
          <div>
            <b>{ov.games}</b>
            <span>대국</span>
          </div>
          <div>
            <b>{ov.members}</b>
            <span>멤버</span>
          </div>
          <div>
            <b>{ov.hands.win_rate === null ? '–' : fmtPct(ov.hands.win_rate)}</b>
            <span>화료율(국)</span>
          </div>
          <div>
            <b>{ov.last_game_at ? fmtMonthDay(ov.last_game_at) : '–'}</b>
            <span>최근 대국</span>
          </div>
        </section>
      )}

      <section className="card">
        <div className="card-head">
          <h2>순위표</h2>
        </div>
        <div className="chips" role="tablist" aria-label="기간">
          {PERIODS.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={k === key} className={`chip ${k === key ? 'on' : ''}`} onClick={() => setPeriod(k)}>
              {label}
            </button>
          ))}
        </div>
        {key === 'custom' && (
          <form
            className="date-range"
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              setPeriod('custom', { from: String(f.get('from') || ''), to: String(f.get('to') || '') })
            }}
          >
            <input type="date" name="from" defaultValue={range.from} aria-label="시작 날짜" />
            <span>~</span>
            <input type="date" name="to" defaultValue={range.to} aria-label="끝 날짜" />
            <button className="btn small" type="submit">
              보기
            </button>
          </form>
        )}
        {range.from && (
          <p className="hint">
            {range.from} ~ {range.to ?? '오늘'}
          </p>
        )}

        <Status loading={members.loading} error={members.error} onRetry={members.reload} />
        {members.data && list.length === 0 && <Empty>이 기간에 올라온 대국이 없습니다.</Empty>}
        {list.length > 0 && (
          <div className="table-wrap">
            <table className="board">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>이름</th>
                  <th className="num">정산 합</th>
                  <th className="num" title="평균 순위">평균</th>
                  <th className="num">1위율</th>
                  <th className="num">4위율</th>
                  <th className="num">별</th>
                  <th className="num">국</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m, i) => (
                  <tr key={m.name}>
                    <td className="num muted">{i + 1}</td>
                    <td className="name">
                      <MemberLink name={m.name} />
                    </td>
                    <td className={`num strong ${scoreClass(m.total)}`}>{fmtScore(m.total)}</td>
                    <td className="num">{m.avg_rank.toFixed(2)}</td>
                    <td className="num">{fmtPct(m.top_rate, 0)}</td>
                    <td className="num">{fmtPct(m.last_rate, 0)}</td>
                    <td className="num">{m.stars}</td>
                    <td className="num">{m.games}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="hint">정산 합은 우마 · 오카를 넣은 천 점 단위. 같으면 평균 순위, 이름 순.</p>
      </section>

      {ov && ov.monthly.length > 0 && (
        <section className="card">
          <div className="card-head">
            <h2>월별 대국 수</h2>
          </div>
          <div className="month-bars">
            {ov.monthly.slice(-12).map((m) => {
              const max = Math.max(...ov.monthly.slice(-12).map((x) => x.games), 1)
              return (
                <div key={m.month} className="mb">
                  <span className="mb-val">{m.games}</span>
                  <span className="mb-bar" style={{ height: `${(m.games / max) * 100}%` }} />
                  <span className="mb-label">{Number(m.month.slice(5))}월</span>
                </div>
              )
            })}
          </div>
          <p className="hint">
            국 결과 {ov.hands.total}국 중 화료 {ov.hands.win} · 유국 {ov.hands.draw}
            {ov.hands.draw_rate !== null && ` (유국 ${fmtPct(ov.hands.draw_rate)})`} — 직접 입력한 대국은 빼고 셈.
          </p>
        </section>
      )}
    </>
  )
}
