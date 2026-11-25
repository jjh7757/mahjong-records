// 가벼운 SVG 그래프(라이브러리 없음). viewBox 너비를 실제 너비에 맞춰 글자 크기가 화면 크기와 상관없이 같게 한다.
import { useEffect, useRef, useState } from 'react'
import { seatColor } from '../format'

function useWidth(initial = 640) {
  const ref = useRef<HTMLElement | null>(null)
  const [w, setW] = useState(initial)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const set = () => setW(Math.max(260, Math.round(el.getBoundingClientRect().width)))
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export interface Series {
  name: string
  color: string
  values: number[]
}

/** 점수 흐름: x = 국, y = 점수. */
export function LineChart({
  series,
  labels,
  height = 220,
  yFormat = (v: number) => `${Math.round(v / 1000)}k`,
  baseline,
}: {
  series: Series[]
  labels: string[]
  height?: number
  yFormat?: (v: number) => string
  baseline?: number
}) {
  const [ref, W] = useWidth()
  const H = height
  const pad = { l: 40, r: 12, t: 12, b: 28 }
  const n = labels.length
  const all = series.flatMap((s) => s.values)
  if (n === 0 || all.length === 0) return null
  let lo = Math.min(...all, baseline ?? Infinity)
  let hi = Math.max(...all, baseline ?? -Infinity)
  if (lo === hi) {
    lo -= 1000
    hi += 1000
  }
  const step = niceStep((hi - lo) / 4)
  lo = Math.floor(lo / step) * step
  hi = Math.ceil(hi / step) * step
  const x = (i: number) => pad.l + (n === 1 ? (W - pad.l - pad.r) / 2 : (i * (W - pad.l - pad.r)) / (n - 1))
  const y = (v: number) => pad.t + ((hi - v) * (H - pad.t - pad.b)) / (hi - lo)
  const ticks: number[] = []
  for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(v)
  const every = Math.max(1, Math.ceil(n / Math.max(3, Math.floor(W / 70))))

  return (
    <figure className="chart" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="점수 흐름 그래프">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className={v === baseline ? 'grid base' : 'grid'} />
            <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" className="axis">
              {yFormat(v)}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          i % every === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="axis">
              {l}
            </text>
          ) : null,
        )}
        {series.map((s) => (
          <g key={s.name}>
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinejoin="round"
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
            />
            {s.values.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r={n > 24 ? 0 : 3} fill={s.color}>
                <title>{`${s.name} ${labels[i]}: ${v.toLocaleString('ko-KR')}`}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
      <figcaption className="legend">
        {series.map((s) => (
          <span key={s.name}>
            <i style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

function niceStep(raw: number): number {
  if (raw <= 0) return 1000
  const p = Math.pow(10, Math.floor(Math.log10(raw)))
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= raw) return m * p
  return 10 * p
}

/** 순위 흐름: y 1(위) ~ 4(아래). */
export function RankChart({ ranks, labels }: { ranks: number[]; labels: string[] }) {
  const [ref, W] = useWidth()
  const H = 176
  const pad = { l: 34, r: 12, t: 14, b: 34 }
  const n = ranks.length
  if (n === 0) return null
  const x = (i: number) => pad.l + (n === 1 ? (W - pad.l - pad.r) / 2 : (i * (W - pad.l - pad.r)) / (n - 1))
  const y = (r: number) => pad.t + ((r - 1) * (H - pad.t - pad.b)) / 3
  const every = Math.max(1, Math.ceil(n / Math.max(3, Math.floor(W / 60))))
  return (
    <figure className="chart" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="최근 순위 흐름 그래프">
        {[1, 2, 3, 4].map((r) => (
          <g key={r}>
            <line x1={pad.l} x2={W - pad.r} y1={y(r)} y2={y(r)} className="grid" />
            <text x={pad.l - 8} y={y(r) + 4} textAnchor="end" className="axis">
              {r}위
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          i % every === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="axis">
              {l}
            </text>
          ) : null,
        )}
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          points={ranks.map((r, i) => `${x(i)},${y(r)}`).join(' ')}
        />
        {ranks.map((r, i) => (
          <circle key={i} cx={x(i)} cy={y(r)} r={4.5} className={`rank-dot r${r}`}>
            <title>{`${labels[i]}: ${r}위`}</title>
          </circle>
        ))}
      </svg>
    </figure>
  )
}

/** 1~4위 분포 막대. */
export function RankBars({ counts }: { counts: number[] }) {
  const total = counts.reduce((a, b) => a + b, 0) || 1
  const max = Math.max(...counts, 1)
  return (
    <div className="rank-bars">
      {counts.map((c, i) => (
        <div key={i} className="rank-bar">
          <span className="rb-label">{i + 1}위</span>
          <span className="rb-track">
            <span className={`rb-fill r${i + 1}`} style={{ width: `${(c / max) * 100}%` }} />
          </span>
          <span className="rb-value">
            {c}회 <small>{((c / total) * 100).toFixed(0)}%</small>
          </span>
        </div>
      ))}
    </div>
  )
}

export { seatColor }
