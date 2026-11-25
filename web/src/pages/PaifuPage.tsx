import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useApi } from '../api'
import { Status } from '../components/common'
import { Tile, TileRow } from '../components/Tile'
import { WINDS, seatColor } from '../format'
import { CALL_NAME, RESULT_NAME, buildStates, heroTurnSteps, tileInfo, wallLeft, type PaifuState } from '../paifu'
import { Link, gamePath } from '../router'
import type { GameDetail, PaifuEventRaw, PaifuRaw } from '../types'
import { paifuLabel } from './GamePage'

const SPEEDS = [
  [1500, '느리게'],
  [800, '보통'],
  [350, '빠르게'],
] as const

// hero 기준 자리 이름(hero 아래, 차례 순서 0→1→2→3 이 반시계).
const SIDE = ['손패 주인', '하가', '대면', '상가']

export function PaifuPage({ gameId, seq }: { gameId: number; seq: number }) {
  const d = useApi<GameDetail>(`/v1/games/${gameId}`)
  const round = d.data?.paifu.find((p) => p.seq === seq)
  if (!d.data) return <Status loading={d.loading} error={d.error} onRetry={d.reload} />
  if (!round) return <Status error="이 패보가 없습니다." />
  const names = [0, 1, 2, 3].map(
    (s) => d.data!.players.find((p) => p.seat === s)?.name || round.raw.names?.[s] || `자리 ${s}`,
  )
  return (
    <Replay
      key={`${gameId}-${seq}`}
      p={round.raw}
      names={names}
      title={paifuLabel(round)}
      back={gamePath(gameId)}
    />
  )
}

function Replay({ p, names, title, back }: { p: PaifuRaw; names: string[]; title: string; back: string }) {
  const states = useMemo(() => buildStates(p), [p])
  const turns = useMemo(() => heroTurnSteps(p, states), [p, states])
  const last = states.length - 1
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(800)

  const go = useCallback((n: number) => setStep(Math.max(0, Math.min(last, n))), [last])

  useEffect(() => {
    if (!playing) return
    if (step >= last) {
      setPlaying(false)
      return
    }
    const t = window.setTimeout(() => setStep((s) => Math.min(last, s + 1)), speed)
    return () => window.clearTimeout(t)
  }, [playing, step, last, speed])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'ArrowRight') go(step + 1)
      else if (e.key === 'ArrowLeft') go(step - 1)
      else if (e.key === ' ') {
        e.preventDefault()
        setPlaying((x) => !x)
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [go, step])

  const s = states[step]
  const hero = p.hero
  const dealer = p.dealer ?? 0
  const nextTurn = turns.find((t) => t > step)
  const prevTurn = [...turns].reverse().find((t) => t < step)
  const order = [1, 2, 3].map((k) => (hero + k) % 4) // 하가 · 대면 · 상가
  const actor = s.event?.seat ?? null

  return (
    <>
      <div className="page-head">
        <Link to={back} className="back">
          ← 대국으로
        </Link>
        <h1>
          {title} <small>패보</small>
        </h1>
        <p className="sub">
          친 {names[dealer]} · 손패 주인 {names[hero]}
          {p.kyotaku ? ` · 공탁 ${p.kyotaku}` : ''}
        </p>
      </div>

      <section className="replay-top card">
        <div className="dora">
          <span className="lbl">도라 표시</span>
          {(p.dora_indicators ?? []).length ? <TileRow tiles={p.dora_indicators!} size="sm" /> : <span className="muted">–</span>}
        </div>
        <div className="meta">
          <span>
            걸음 <b>{step}</b>/{last}
          </span>
          <span>남은 패산 {wallLeft(s)}</span>
        </div>
        <p className="now" aria-live="polite">
          {describe(s, names, p)}
        </p>
      </section>

      <div className="seats">
        {order.map((seat) => (
          <SeatPanel
            key={seat}
            seat={seat}
            side={SIDE[(seat - hero + 4) % 4]}
            name={names[seat]}
            wind={WINDS[(seat - dealer + 4) % 4]}
            s={s}
            active={actor === seat}
          />
        ))}
        <SeatPanel seat={hero} side={SIDE[0]} name={names[hero]} wind={WINDS[(hero - dealer + 4) % 4]} s={s} active={actor === hero} hero>
          <HeroHand s={s} />
        </SeatPanel>
      </div>

      {s.finished && p.result && <ResultPanel p={p} names={names} />}

      <div className="controls" role="toolbar" aria-label="재생">
        <input
          type="range"
          min={0}
          max={last}
          value={step}
          onChange={(e) => go(Number(e.target.value))}
          aria-label="걸음"
          className="scrub"
        />
        <div className="ctrl-row">
          <button className="btn icon" onClick={() => go(0)} aria-label="처음">
            ⏮
          </button>
          <button className="btn icon" onClick={() => go(step - 1)} aria-label="이전" disabled={step === 0}>
            ◀
          </button>
          <button className="btn icon primary" onClick={() => (step >= last ? (go(0), setPlaying(true)) : setPlaying((x) => !x))} aria-label={playing ? '멈춤' : '자동 재생'}>
            {playing ? '❚❚' : '▶'}
          </button>
          <button className="btn icon" onClick={() => go(step + 1)} aria-label="다음" disabled={step === last}>
            ▶︎|
          </button>
          <button className="btn icon" onClick={() => go(last)} aria-label="끝">
            ⏭
          </button>
        </div>
        <div className="ctrl-row">
          <button className="btn small" disabled={prevTurn === undefined} onClick={() => prevTurn !== undefined && go(prevTurn)}>
            ← 주인 차례
          </button>
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label="재생 빠르기" className="speed">
            {SPEEDS.map(([ms, label]) => (
              <option key={ms} value={ms}>
                {label}
              </option>
            ))}
          </select>
          <button className="btn small" disabled={nextTurn === undefined} onClick={() => nextTurn !== undefined && go(nextTurn)}>
            주인 차례 →
          </button>
        </div>
      </div>
      {p.note && <p className="hint note">메모: {p.note}</p>}
    </>
  )
}

function SeatPanel({
  seat,
  side,
  name,
  wind,
  s,
  active,
  hero,
  children,
}: {
  seat: number
  side: string
  name: string
  wind: string
  s: PaifuState
  active: boolean
  hero?: boolean
  children?: ReactNode
}) {
  const river = s.rivers[seat]
  const melds = s.melds[seat]
  const lastIdx = active && s.event?.type === 'discard' ? river.length - 1 : -1
  return (
    <section className={`seat ${active ? 'active' : ''} ${hero ? 'hero' : ''}`} style={{ borderLeftColor: seatColor(seat) }}>
      <header className="seat-head">
        <span className="wind">{wind}</span>
        <span className="seat-name">{name}</span>
        <span className="seat-side">{side}</span>
        {s.riichi[seat] && <span className="tag riichi">리치</span>}
        <span className="seat-count">{river.length}장</span>
      </header>
      <div className="river" aria-label={`${name} 버린 패`}>
        {river.length === 0 && <span className="muted small">버린 패 없음</span>}
        {river.map((r, i) => (
          <Tile key={i} code={r.tile} size="sm" dim={r.tsumogiri === true} sideways={r.riichi} called={r.called} highlight={i === lastIdx} />
        ))}
      </div>
      {melds.length > 0 && (
        <div className="melds">
          {melds.map((m, i) => (
            <span key={i} className="meld">
              <span className="meld-kind">{CALL_NAME[m.kind] ?? m.kind}</span>
              <TileRow tiles={m.tiles} size="sm" />
            </span>
          ))}
        </div>
      )}
      {children}
    </section>
  )
}

function HeroHand({ s }: { s: PaifuState }) {
  if (!s.heroHand) return <p className="muted small hand-unknown">이때 손패는 기록에 없습니다.</p>
  return (
    <div className="hero-hand" aria-label="손패">
      {s.heroHand.map((t, i) => (
        <Tile key={i} code={t} />
      ))}
      {s.hasDrawn && (
        <span className="drawn">
          <Tile code={s.drawn} highlight title={s.drawn ? `뽑은 패 ${tileInfo(s.drawn).name}` : '뽑은 패(모름)'} />
        </span>
      )}
    </div>
  )
}

function describe(s: PaifuState, names: string[], p: PaifuRaw): string {
  if (s.step === 0) return `${names[p.dealer ?? 0]} 친으로 시작`
  if (s.finished) {
    const r = p.result!
    const kind = RESULT_NAME[r.type] ?? r.type
    if (r.type === 'ron') return `${names[r.winner ?? 0]} ${kind} ← ${names[r.loser ?? 0]}`
    if (r.type === 'tsumo') return `${names[r.winner ?? 0]} ${kind}`
    return kind
  }
  const e = s.event as PaifuEventRaw
  const who = names[e.seat]
  if (e.type === 'draw') return `${who}: 뽑음 ${e.tile ? tileInfo(e.tile).name : '(모름)'}${e.guess ? ' · 짐작' : ''}`
  if (e.type === 'discard') {
    const extra = [e.riichi ? '리치 선언' : '', e.tsumogiri === true ? '쯔모기리' : e.tsumogiri === false ? '손에서' : '']
      .filter(Boolean)
      .join(' · ')
    return `${who}: 버림 ${tileInfo(e.tile).name}${extra ? ` (${extra})` : ''}`
  }
  const kind = CALL_NAME[e.kind ?? 'call'] ?? e.kind
  const from = e.from !== null && e.from !== undefined && e.from !== e.seat ? ` ← ${names[e.from]}` : ''
  return `${who}: ${kind}${from} ${(e.tiles ?? []).map((t) => tileInfo(t).name).join(' ')}`
}

function ResultPanel({ p, names }: { p: PaifuRaw; names: string[] }) {
  const r = p.result!
  const melds = (r.melds ?? []).map((m) => (Array.isArray(m) ? { kind: '', tiles: m } : { kind: m.kind ?? '', tiles: m.tiles ?? [] }))
  const flags = Object.entries(r.flags ?? {})
    .filter(([, v]) => v)
    .map(([k]) => FLAG[k] ?? k)
  return (
    <section className="card result">
      <div className="card-head">
        <h2>{RESULT_NAME[r.type] ?? r.type}</h2>
      </div>
      {r.type === 'draw' ? (
        <p>
          텐파이:{' '}
          {r.tenpai === undefined ? '기록 없음' : r.tenpai.length === 0 ? '모두 노텐' : r.tenpai.map((s) => names[s]).join(' · ')}
        </p>
      ) : (
        <>
          <p>
            <b>{names[r.winner ?? 0]}</b>
            {r.type === 'ron' && r.loser !== null && r.loser !== undefined ? ` ← ${names[r.loser]} 방총` : ' 쯔모'}
            {flags.length > 0 && <span className="muted"> · {flags.join(' · ')}</span>}
          </p>
          {r.hand && (
            <div className="hero-hand">
              {r.hand.map((t, i) => (
                <Tile key={i} code={t} />
              ))}
              {r.win_tile && (
                <span className="drawn">
                  <Tile code={r.win_tile} highlight title={`화료패 ${tileInfo(r.win_tile).name}`} />
                </span>
              )}
            </div>
          )}
          {melds.length > 0 && (
            <div className="melds">
              {melds.map((m, i) => (
                <span key={i} className="meld">
                  {m.kind && <span className="meld-kind">{CALL_NAME[m.kind] ?? m.kind}</span>}
                  <TileRow tiles={m.tiles} size="sm" />
                </span>
              ))}
            </div>
          )}
        </>
      )}
      {(p.ura_indicators ?? []).length > 0 && (
        <div className="dora">
          <span className="lbl">뒷도라 표시</span>
          <TileRow tiles={p.ura_indicators!} size="sm" />
        </div>
      )}
    </section>
  )
}

const FLAG: Record<string, string> = {
  riichi: '리치',
  double_riichi: '더블 리치',
  ippatsu: '일발',
  last_tile: '해저 · 하저',
  rinshan: '영상',
  chankan: '창깡',
  first_turn: '첫 순',
}
