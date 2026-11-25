import { useMemo } from 'react'
import { useApi } from '../api'
import { LineChart } from '../components/charts'
import { MemberLink, RankBadge, Status } from '../components/common'
import { fmtDateTime, fmtDelta, fmtPoints, fmtScore, scoreClass, seatColor } from '../format'
import { RESULT_NAME } from '../paifu'
import { Link, paifuPath } from '../router'
import type { GameDetail, GameEventRow, PaifuRound } from '../types'

const KIND: Record<string, string> = {
  win: '화료',
  riichi: '리치',
  draw: '유국',
  adjust: '정정',
  end: '종료',
  note: '메모',
}

interface Hand {
  label: string
  events: GameEventRow[]
  after: number[]
  paifu: PaifuRound | null
}

export const paifuLabel = (p: { round: string; honba: number }) => `${p.round}${p.honba > 0 ? ` ${p.honba}본장` : ''}`

const shortLabel = (l: string) => l.replace('국', '').replace(/\s*(\d+)본장/, '-$1')

function groupHands(g: GameDetail): Hand[] {
  const start = g.settings.startPoints ?? 25000
  const scores = [start, start, start, start]
  const byLabel = new Map<string, PaifuRound>()
  for (const p of g.paifu) if (!byLabel.has(paifuLabel(p))) byLabel.set(paifuLabel(p), p)
  const hands: Hand[] = []
  for (const e of g.events) {
    let h = hands[hands.length - 1]
    if (!h || h.label !== e.round) {
      h = { label: e.round, events: [], after: [], paifu: byLabel.get(e.round) ?? null }
      hands.push(h)
    }
    h.events.push(e)
    e.delta.forEach((d, i) => (scores[i] += d))
    h.after = scores.slice()
  }
  return hands
}

export function GamePage({ id }: { id: number }) {
  const d = useApi<GameDetail>(`/v1/games/${id}`)
  const g = d.data
  const hands = useMemo(() => (g ? groupHands(g) : []), [g])

  if (!g) return <Status loading={d.loading} error={d.error} onRetry={d.reload} />

  const bySeat = g.players.slice().sort((a, b) => a.seat - b.seat)
  const byRank = g.players.slice().sort((a, b) => a.rank - b.rank)
  const start = g.settings.startPoints ?? 25000
  const chartHands = hands.filter((h) => h.events.some((e) => e.delta.some((x) => x !== 0)) || h === hands[hands.length - 1])
  const matched = new Set(hands.map((h) => h.paifu?.seq).filter((x) => x !== undefined))
  const loose = g.paifu.filter((p) => !matched.has(p.seq))

  return (
    <>
      <div className="page-head">
        <Link to="games" className="back">
          ← 대국 목록
        </Link>
        <h1>{fmtDateTime(g.started_at)}</h1>
        <p className="sub">
          {g.east_only ? '동풍전' : '반장전'}
          {g.ended_by && ` · ${g.ended_by}`}
          {` · ${g.store}`}
        </p>
      </div>

      <section className="card">
        <div className="card-head">
          <h2>정산</h2>
        </div>
        <table className="settle">
          <thead>
            <tr>
              <th>순위</th>
              <th>이름</th>
              <th className="num">최종 점수</th>
              <th className="num">정산</th>
              <th className="num">별</th>
            </tr>
          </thead>
          <tbody>
            {byRank.map((p) => (
              <tr key={p.seat}>
                <td>
                  <RankBadge rank={p.rank} />
                </td>
                <td>
                  <i className="seat-dot" style={{ background: seatColor(p.seat) }} />
                  <MemberLink name={p.name} />
                </td>
                <td className={`num ${p.bust ? 'neg' : ''}`}>{fmtPoints(p.final_points)}</td>
                <td className={`num strong ${scoreClass(p.score)}`}>{fmtScore(p.score)}</td>
                <td className="num">{p.stars || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint">
          시작 {fmtPoints(start)} · 반환 {fmtPoints(g.settings.returnPoints ?? 30000)} · 우마 {g.settings.umaSmall ?? 10}-{g.settings.umaBig ?? 20}
        </p>
      </section>

      {!g.manual && chartHands.length > 1 && (
        <section className="card">
          <div className="card-head">
            <h2>점수 흐름</h2>
          </div>
          <LineChart
            labels={['시작', ...chartHands.map((h) => shortLabel(h.label))]}
            series={bySeat.map((p) => ({
              name: p.name,
              color: seatColor(p.seat),
              values: [start, ...chartHands.map((h) => h.after[p.seat])],
            }))}
            baseline={start}
          />
        </section>
      )}

      <section className="card">
        <div className="card-head">
          <h2>국별 기록</h2>
        </div>
        <div className="seat-legend">
          {bySeat.map((p) => (
            <span key={p.seat}>
              <i className="seat-dot" style={{ background: seatColor(p.seat) }} />
              {p.name}
            </span>
          ))}
        </div>
        <ol className="hands">
          {hands.map((h, i) => (
            <li key={i} className="hand">
              <div className="hand-head">
                <span className="hand-label">{h.label}</span>
                {h.paifu && (
                  <Link to={paifuPath(g.id, h.paifu.seq)} className="btn small accent">
                    패보 보기
                  </Link>
                )}
              </div>
              {h.events.map((e) => (
                <div key={e.seq} className={`ev ev-${e.kind}`}>
                  <span className="ev-kind">{KIND[e.kind] ?? e.kind}</span>
                  <span className="ev-desc">{e.description}</span>
                  {e.delta.some((x) => x !== 0) && (
                    <span className="ev-delta">
                      {e.delta.map((x, s) =>
                        x === 0 ? null : (
                          <span key={s} className={`dchip ${x > 0 ? 'pos' : 'neg'}`}>
                            <i className="seat-dot" style={{ background: seatColor(s) }} />
                            {bySeat[s]?.name} {fmtDelta(x)}
                          </span>
                        ),
                      )}
                    </span>
                  )}
                </div>
              ))}
            </li>
          ))}
        </ol>
      </section>

      {g.paifu.length > 0 && (
        <section className="card">
          <div className="card-head">
            <h2>패보 ({g.paifu.length})</h2>
          </div>
          <ul className="paifu-list">
            {g.paifu.map((p) => (
              <li key={p.seq}>
                <Link to={paifuPath(g.id, p.seq)} className="paifu-item">
                  <span className="pi-round">{paifuLabel(p)}</span>
                  <span className="pi-result">{paifuResultText(p, bySeat.map((x) => x.name))}</span>
                  <span className="pi-go">재생 →</span>
                </Link>
              </li>
            ))}
          </ul>
          {loose.length > 0 && <p className="hint">국 이름이 기록과 맞지 않는 패보도 위 목록에서 볼 수 있습니다.</p>}
        </section>
      )}
      <p className="foot-meta">
        올림 {fmtDateTime(g.uploaded_at)}
        {g.updated_at !== g.uploaded_at && ` · 고침 ${fmtDateTime(g.updated_at)}`}
        {g.app_version && ` · 앱 ${g.app_version}`}
      </p>
    </>
  )
}

export function paifuResultText(p: PaifuRound, names: string[]): string {
  const nm = (s: number | null) => (s === null || s === undefined ? '' : (names[s] || p.raw.names?.[s] || `자리 ${s}`))
  if (!p.result_type) return '결과 없음'
  const kind = RESULT_NAME[p.result_type] ?? p.result_type
  if (p.result_type === 'ron') return `${nm(p.winner)} ${kind} ← ${nm(p.loser)}`
  if (p.result_type === 'tsumo') return `${nm(p.winner)} ${kind}`
  return kind
}
