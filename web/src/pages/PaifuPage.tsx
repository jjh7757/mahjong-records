// 패보 재생 화면. 앱 lib/ui/paifu/paifu_screen.dart 의 재생 화면(PaifuTableView + 오른쪽 패널)과 같은 구성:
// 넓은 화면은 왼쪽 탁자 + 오른쪽 패널, 좁은 화면은 탁자 위 + 패널 아래.
// 앱의 "점수 결과 보기"(점수 계산 엔진)와 걸음 옆 등급(복기 엔진)은 없다 — 끝 걸음에 패보에 적힌 결과 한 줄만.
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useApi } from '../api'
import { Status } from '../components/common'
import { PaifuTable, TABLE_H, TABLE_W } from '../components/PaifuTable'
import { Tile } from '../components/Tile'
import { WINDS } from '../format'
import {
  RESULT_NAME,
  buildStates,
  hasHeroHands,
  heroTurnSteps,
  tileInfo,
  turnOf,
  windOf,
  type PaifuState,
} from '../paifu'
import { Link, gamePath } from '../router'
import type { GameDetail, PaifuRaw } from '../types'
import { paifuLabel } from './GamePage'

/** 앱 _speeds 와 같은 간격(ms). */
const SPEEDS = [
  [2000, '느리게'],
  [1000, '보통'],
  [400, '빠르게'],
] as const

/** 걸음 목록 한 줄 높이(px). 지금 걸음이 위에서 세 번째 줄에 오게 굴린다(앱 _rowH). */
const ROW_H = 40

const WIDE_QUERY = '(min-width: 960px)'

export function PaifuPage({ gameId, seq }: { gameId: number; seq: number }) {
  const d = useApi<GameDetail>(`/v1/games/${gameId}`)
  const round = d.data?.paifu.find((p) => p.seq === seq)
  if (!d.data) return <Status loading={d.loading} error={d.error} onRetry={d.reload} />
  if (!round) return <Status error="이 패보가 없습니다." />
  const names = [0, 1, 2, 3].map(
    (s) => d.data!.players.find((p) => p.seat === s)?.name || round.raw.names?.[s] || `자리 ${s}`,
  )
  return <Replay key={`${gameId}-${seq}`} p={round.raw} names={names} title={paifuLabel(round)} back={gamePath(gameId)} />
}

function useMedia(q: string): boolean {
  const [on, setOn] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const f = () => setOn(m.matches)
    f()
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [q])
  return on
}

/** 탁자를 담는 칸의 크기에서 강 패 한 장 너비 w 를 정한다(넓은 화면은 가로 · 세로 중 작은 쪽, 좁은 화면은 가로만). */
function useTableW(wide: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const calc = () => {
      const byW = el.clientWidth / TABLE_W
      const byH = wide ? el.clientHeight / TABLE_H : Infinity
      setW(Math.max(8, Math.floor(Math.min(byW, byH) * 100) / 100))
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [wide])
  return [ref, w] as const
}

function Replay({ p, names, title, back }: { p: PaifuRaw; names: string[]; title: string; back: string }) {
  const states = useMemo(() => buildStates(p), [p])
  const turns = useMemo(() => heroTurnSteps(p, states), [p, states])
  const heroHands = useMemo(() => hasHeroHands(p), [p])
  const last = states.length - 1
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(1000)
  const wide = useMedia(WIDE_QUERY)
  const [boxRef, w] = useTableW(wide)
  const listRef = useRef<HTMLOListElement>(null)

  const go = useCallback((n: number) => setStep(Math.max(0, Math.min(last, n))), [last])
  const play = useCallback(() => {
    if (step >= last) setStep(0)
    setPlaying(true)
  }, [step, last])
  const toggle = useCallback(() => (playing ? setPlaying(false) : play()), [playing, play])
  /** 내 차례(hero 가 뽑은 걸음) 단위로 넘긴다. 없으면 끝 · 처음으로. */
  const heroTurn = useCallback(
    (dir: number) => {
      if (dir > 0) go(turns.find((t) => t > step) ?? last)
      else go([...turns].reverse().find((t) => t < step) ?? 0)
    },
    [go, turns, step, last],
  )

  // 자동 재생: 끝에 닿으면 멈춤.
  useEffect(() => {
    if (!playing) return
    if (step >= last) {
      setPlaying(false)
      return
    }
    const t = window.setTimeout(() => setStep((s) => Math.min(last, s + 1)), speed)
    return () => window.clearTimeout(t)
  }, [playing, step, last, speed])

  // 걸음 목록: 지금 걸음이 위에서 세 번째 줄에 오게(목록 안에서만 굴린다 — 페이지는 그대로).
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: Math.max(0, (step - 2) * ROW_H), behavior: 'smooth' })
  }, [step])

  // 키보드: ← → 한 걸음, ↑ ↓ 내 차례, 스페이스 재생 · 멈춤, Home · End 처음 · 끝.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      const tag = t?.tagName
      if (tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return
      if (tag === 'INPUT' && (t as HTMLInputElement).type !== 'range') return
      const range = tag === 'INPUT' // 슬라이더는 ← → Home End 를 스스로 받는다(onChange 로 옮김).
      switch (e.key) {
        case 'ArrowRight':
          if (range) return
          e.preventDefault()
          go(step + 1)
          break
        case 'ArrowLeft':
          if (range) return
          e.preventDefault()
          go(step - 1)
          break
        case 'ArrowDown':
          e.preventDefault()
          heroTurn(1)
          break
        case 'ArrowUp':
          e.preventDefault()
          heroTurn(-1)
          break
        case 'Home':
          if (range) return
          e.preventDefault()
          go(0)
          break
        case 'End':
          if (range) return
          e.preventDefault()
          go(last)
          break
        case ' ':
        case 'Spacebar':
          // 단추에 포커스가 있어도 그 단추를 누르지 않고 재생 · 멈춤만.
          e.preventDefault()
          if (!e.repeat) toggle()
          break
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [go, step, last, heroTurn, toggle])

  const s = states[step]
  const seatLabel = (seat: number) => `${WINDS[windOf(p, seat)]}${names[seat] ? ` ${names[seat]}` : ''}`
  const describe = (x: PaifuState) => describeStep(x, p, seatLabel)

  return (
    <div className="pf-page">
      <div className="pf-head">
        <Link to={back} className="back">
          ← 대국으로
        </Link>
        <h1>
          {title} <small>패보</small>
        </h1>
      </div>
      <div className={`pf-stage ${wide ? 'wide' : 'narrow'}`}>
        <div className="pf-tablebox" ref={boxRef}>
          {w > 0 && <PaifuTable p={p} s={s} names={names} w={w} />}
        </div>
        <aside className="pf-panel">
          <p className="pf-info">
            {p.round ?? title}
            {p.honba ? ` ${p.honba}본장` : ''} · {turnOf(s)}순 · {heroHands ? '내 자리' : '아래 자리'} {seatLabel(p.hero)}
            {p.kyotaku ? ` · 공탁 ${p.kyotaku}` : ''}
          </p>
          <p className="pf-now" aria-live="polite">
            {describe(s)}
          </p>
          <input
            type="range"
            min={0}
            max={last}
            value={step}
            onChange={(e) => go(Number(e.target.value))}
            aria-label="걸음"
            className="pf-slider"
          />
          <div className="pf-buttons" role="toolbar" aria-label="재생">
            <IconBtn label="처음 (Home)" onClick={() => go(0)}>
              <Ico d="M6 5v14M19 5l-9 7 9 7z" />
            </IconBtn>
            <IconBtn label="이전 내 차례 (↑)" onClick={() => heroTurn(-1)}>
              <Ico d="M11 6l-8 6 8 6zM21 6l-8 6 8 6z" fill />
            </IconBtn>
            <IconBtn label="이전 (←)" onClick={() => go(step - 1)}>
              <Ico d="M15 5l-7 7 7 7" />
            </IconBtn>
            <button type="button" className="pf-play" onClick={toggle} title={playing ? '멈춤 (스페이스)' : '자동 재생 (스페이스)'} aria-label={playing ? '멈춤' : '자동 재생'}>
              {playing ? <Ico d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill /> : <Ico d="M8 5v14l11-7z" fill />}
            </button>
            <IconBtn label="다음 (→)" onClick={() => go(step + 1)}>
              <Ico d="M9 5l7 7-7 7" />
            </IconBtn>
            <IconBtn label="다음 내 차례 (↓)" onClick={() => heroTurn(1)}>
              <Ico d="M3 6l8 6-8 6zM13 6l8 6-8 6z" fill />
            </IconBtn>
            <IconBtn label="끝 (End)" onClick={() => go(last)}>
              <Ico d="M18 5v14M5 5l9 7-9 7z" />
            </IconBtn>
          </div>
          <div className="pf-speedrow">
            <span className="pf-count">
              {step} / {last}
            </span>
            <span className="pf-speeds" role="radiogroup" aria-label="재생 빠르기">
              {SPEEDS.map(([ms, label]) => (
                <button
                  key={ms}
                  type="button"
                  role="radio"
                  aria-checked={speed === ms}
                  className={`pf-chip${speed === ms ? ' on' : ''}`}
                  onClick={() => setSpeed(ms)}
                >
                  {speed === ms && <Ico d="M5 12l5 5 9-10" />}
                  {label}
                </button>
              ))}
            </span>
          </div>
          {s.finished && p.result && <ResultLine p={p} seatLabel={seatLabel} />}
          <p className="pf-legend">어두운 패 = 쯔모기리 · 누운 패 = 리치 선언 · 테두리 = 방금 버린 패</p>
          {p.note && (
            <p className="pf-note" title={p.note}>
              {p.note}
            </p>
          )}
          <ol className="pf-log" ref={listRef} aria-label="걸음 목록">
            {states.map((x, i) => {
              const mine = x.event?.seat === p.hero
              const now = i === step
              return (
                <li key={i} style={{ height: ROW_H }}>
                  <button
                    type="button"
                    className={`${now ? 'now' : ''}${mine ? ' mine' : ''}`}
                    onClick={() => go(i)}
                    aria-current={now ? 'step' : undefined}
                  >
                    <span className="pf-log-n">{i}</span>
                    <span className="pf-log-t">{describe(x)}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </aside>
      </div>
    </div>
  )
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="pf-ibtn" onClick={onClick} title={label} aria-label={label}>
      {children}
    </button>
  )
}

function Ico({ d, fill }: { d: string; fill?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d={d}
        fill={fill ? 'currentColor' : 'none'}
        stroke={fill ? 'none' : 'currentColor'}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const tileName = (t: string | null | undefined) => tileInfo(t).name

/** 걸음 한 줄 설명(앱 _describe 와 같은 글). */
function describeStep(s: PaifuState, p: PaifuRaw, seatLabel: (seat: number) => string): string {
  const e = s.event
  if (!e) {
    if (!s.finished) return '시작'
    const r = p.result!
    const win = r.win_tile ? ` (${tileName(r.win_tile)})` : ''
    if (r.type === 'ron') return `론${win} — ${seatLabel(r.winner ?? 0)} ← ${seatLabel(r.loser ?? 0)}`
    if (r.type === 'tsumo') return `쯔모${win} — ${seatLabel(r.winner ?? 0)}`
    return '유국'
  }
  const who = seatLabel(e.seat)
  if (e.type === 'draw') return `${who} · ${e.tile ? tileName(e.tile) : '패'} 뽑음`
  if (e.type === 'discard') {
    const how = e.tsumogiri === true ? ' (쯔모기리)' : e.tsumogiri === false ? ' (손에서)' : ''
    return `${who} · ${tileName(e.tile)} 버림${how}${e.riichi ? ' · 리치' : ''}`
  }
  const k = e.kind ?? 'call'
  const kind = k === 'chi' ? '치' : k === 'pon' ? '퐁' : k === 'call' ? '울기' : '깡'
  return `${who} · ${kind} ${(e.tiles ?? []).map(tileName).join(' ')}`
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

/** 끝 걸음의 결과 한 줄(앱의 "점수 결과 보기" 자리). 점수는 계산하지 않고 패보에 적힌 것만. */
function ResultLine({ p, seatLabel }: { p: PaifuRaw; seatLabel: (seat: number) => string }) {
  const r = p.result!
  const kind = RESULT_NAME[r.type] ?? r.type
  if (r.type !== 'ron' && r.type !== 'tsumo') {
    const tenpai =
      r.tenpai === undefined ? '텐파이 기록 없음' : r.tenpai.length === 0 ? '모두 노텐' : `텐파이 ${r.tenpai.map(seatLabel).join(' · ')}`
    return (
      <div className="pf-result">
        <b>{kind}</b>
        <span>{tenpai}</span>
      </div>
    )
  }
  const flags = Object.entries(r.flags ?? {})
    .filter(([, v]) => v)
    .map(([k]) => FLAG[k] ?? k)
  return (
    <div className="pf-result">
      <b>{kind}</b>
      {r.win_tile && <Tile code={r.win_tile} w={22} title={`화료패 ${tileName(r.win_tile)}`} />}
      <span>
        {seatLabel(r.winner ?? 0)}
        {r.type === 'ron' && r.loser !== null && r.loser !== undefined ? ` ← ${seatLabel(r.loser)}` : ''}
      </span>
      {flags.length > 0 && <span className="pf-flags">{flags.join(' · ')}</span>}
    </div>
  )
}
