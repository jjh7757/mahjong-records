// 패보 탁자 그림. 앱 lib/ui/paifu/paifu_screen.dart 의 PaifuTableView 를 옮긴 것(복기 화면 막대 · 등급 배지 · 시작 손패
// 헤아리기는 뺌). 모든 크기는 강의 패 한 장 너비 w 의 배수: 판 전체 22.5w × 23.6w(여백 0.3w 포함).
//
// 자리: 아래 = 손패 주인(hero), 차례 순서대로 오른쪽(하가) · 위(대면) · 왼쪽(상가). 각 자리의 강 · 가장자리 띠는
// "아래 자리 기준"으로 그린 뒤 그 자리 쪽으로 돌린다(오른쪽 = 반시계 90°, 위 = 180°, 왼쪽 = 시계 90°).
import type { CSSProperties, ReactNode } from 'react'
import { WINDS } from '../format'
import { hasHeroHands, meldsOf, tileInfo, windOf, type Meld, type PaifuState, type RiverTile } from '../paifu'
import type { PaifuRaw } from '../types'
import { Laid, Tile, TileBack } from './Tile'

export const TABLE_W = 22.5
export const TABLE_H = 23.6

interface Props {
  p: PaifuRaw
  s: PaifuState
  names: string[]
  w: number
}

export function PaifuTable({ p, s, names, w }: Props) {
  const seatAt = (side: number) => (p.hero + side) % 4
  const core = 19.7 * w
  const inner = { w: 21.9 * w, h: 23 * w }
  const strip = (side: number, cx: number, cy: number, deg: number) => (
    <div
      className="pf-abs"
      style={{ left: cx - core / 2, top: cy - 0.55 * w, width: core, height: 1.1 * w, transform: `rotate(${deg}deg)` }}
    >
      <SideStrip p={p} s={s} seat={seatAt(side)} w={w} />
    </div>
  )
  return (
    <div
      className="pf-table"
      style={{ width: TABLE_W * w, height: TABLE_H * w, borderRadius: 0.5 * w }}
      aria-label="탁자"
      role="img"
    >
      <div className="pf-abs" style={{ left: 0.3 * w, top: 0.3 * w, width: inner.w, height: inner.h }}>
        {strip(2, inner.w / 2, 0.55 * w, 180)}
        {strip(3, 0.55 * w, 1.1 * w + core / 2, 90)}
        {strip(1, inner.w - 0.55 * w, 1.1 * w + core / 2, 270)}
        <div className="pf-abs" style={{ left: 1.1 * w, top: 1.1 * w, width: core, height: core }}>
          {[0, 1, 2, 3].map((side) => (
            <div key={side} className="pf-abs pf-fill" style={{ transform: `rotate(${((4 - side) % 4) * 90}deg)` }}>
              <RiverLayer p={p} s={s} seat={seatAt(side)} w={w} side={core} />
            </div>
          ))}
          <Center p={p} s={s} names={names} w={w} side={core} />
        </div>
        <div className="pf-abs" style={{ left: 0, bottom: 0, width: inner.w, height: 2.2 * w }}>
          <HeroStrip p={p} s={s} w={w} />
        </div>
      </div>
    </div>
  )
}

// ── 가운데: 강 · 리치봉 · 판 정보 ──

function RiverLayer({ p, s, seat, w, side }: { p: PaifuRaw; s: PaifuState; seat: number; w: number; side: number }) {
  const c = 6.6 * w
  const all = s.rivers[seat]
  const shown = all.filter((r) => !r.called)
  const e = s.event
  const r = p.result
  // 방금 버린 패(울려 나가지 않았을 때), 또는 론 당한 패.
  const markLast =
    all.length > 0 &&
    !all[all.length - 1].called &&
    ((e?.type === 'discard' && e.seat === seat) || (s.finished && r?.type === 'ron' && r.loser === seat))
  const rows: RiverTile[][] = []
  for (let i = 0; i < shown.length; i += 6) rows.push(shown.slice(i, i + 6))
  return (
    <>
      {s.riichi[seat] && (
        <div
          className="pf-abs pf-stick"
          style={{ top: side / 2 + c / 2 + 0.15 * w, left: (side - 3.4 * w) / 2, width: 3.4 * w, height: 0.3 * w, borderRadius: 0.15 * w }}
        >
          <i style={{ width: 0.16 * w, height: 0.16 * w }} />
        </div>
      )}
      <div className="pf-abs" style={{ top: side / 2 + c / 2 + 0.6 * w, left: (side - c) / 2 }}>
        {rows.map((row, ri) => (
          <div key={ri} className="pf-row" style={{ marginBottom: 0.05 * w }}>
            {row.map((t, i) => {
              const last = markLast && ri * 6 + i === shown.length - 1
              return (
                <span key={i} style={{ marginRight: 0.04 * w }} className="pf-cell">
                  <RiverTileView t={t} w={w} last={last} />
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}

function RiverTileView({ t, w, last }: { t: RiverTile; w: number; last: boolean }) {
  const label = [riverName(t), t.tsumogiri === true ? '쯔모기리' : '', t.riichi ? '리치 선언' : '', last ? '방금 버린 패' : '']
    .filter(Boolean)
    .join(' · ')
  const tile = <Tile code={t.tile} w={w} dim={t.tsumogiri === true} highlight={last} glow={last} title={label} />
  return t.riichi ? <Laid w={w}>{tile}</Laid> : tile
}

const riverName = (t: RiverTile) => tileInfo(t.tile).name

function Center({ p, s, names, w, side }: { p: PaifuRaw; s: PaifuState; names: string[]; w: number; side: number }) {
  const c = 6.6 * w
  const acting = s.event?.seat
  const r = p.result
  const heroHands = hasHeroHands(p)
  const fs = (k: number, min = 7) => Math.max(k * w, min)
  const label = (sd: number) => {
    const seat = (p.hero + sd) % 4
    const on = acting === seat || (s.finished && r?.winner === seat)
    const name = names[seat] ?? ''
    return (
      <span className="pf-label" style={{ maxWidth: c - 1.6 * w }}>
        <b
          className={`pf-wind${(p.dealer ?? 0) === seat ? ' dealer' : ''}`}
          style={{ width: 0.62 * w, height: 0.62 * w, borderRadius: 0.12 * w, fontSize: fs(0.4), marginRight: 0.15 * w }}
        >
          {WINDS[windOf(p, seat)]}
        </b>
        <span className={`pf-name${on ? ' on' : ''}`} style={{ fontSize: fs(0.36) }}>
          {seat === p.hero && heroHands ? (name ? `${name}(나)` : '나') : name}
        </span>
      </span>
    )
  }
  const indicators = (title: string, tiles: string[]) => (
    <span className="pf-ind">
      <span style={{ fontSize: fs(0.32, 6) }}>{title} </span>
      {tiles.map((t, i) => (
        <span key={i} style={{ marginRight: 0.04 * w }} className="pf-cell">
          <Tile code={t} w={0.66 * w} />
        </span>
      ))}
    </span>
  )
  const resultText = !s.finished || !r ? null : r.type === 'ron' ? '론' : r.type === 'tsumo' ? '쯔모' : '유국'
  const pad = 0.14 * w
  const edge: CSSProperties = { position: 'absolute' }
  return (
    <div
      className="pf-center pf-abs"
      style={{ left: (side - c) / 2, top: (side - c) / 2, width: c, height: c, borderRadius: 0.35 * w, borderWidth: 0.06 * w }}
    >
      <div style={{ ...edge, left: pad, right: pad, bottom: pad, display: 'flex', justifyContent: 'center' }}>{label(0)}</div>
      <div style={{ ...edge, left: pad, right: pad, top: pad, display: 'flex', justifyContent: 'center' }}>{label(2)}</div>
      <Turned deg={270} cx={c - pad - 0.31 * w} cy={c / 2} len={c - 2 * pad} h={0.62 * w}>
        {label(1)}
      </Turned>
      <Turned deg={90} cx={pad + 0.31 * w} cy={c / 2} len={c - 2 * pad} h={0.62 * w}>
        {label(3)}
      </Turned>
      <div className="pf-center-mid">
        <span className="pf-round" style={{ fontSize: fs(0.56, 9) }}>
          {p.round ?? ''}
          {p.honba ? ` ${p.honba}본장` : ''}
        </span>
        {resultText ? (
          <span className="pf-res" style={{ fontSize: fs(0.5, 8) }}>
            {resultText}
          </span>
        ) : (
          <span className="pf-wall" style={{ fontSize: fs(0.34) }}>
            남은 패 {Math.max(0, Math.min(70, 70 - s.draws))}
          </span>
        )}
        <span style={{ height: 0.12 * w }} />
        {(p.dora_indicators ?? []).length > 0 && indicators('도라', p.dora_indicators!)}
        {s.finished && (p.ura_indicators ?? []).length > 0 && (
          <span style={{ marginTop: 0.08 * w }}>{indicators('뒷도라', p.ura_indicators!)}</span>
        )}
      </div>
    </div>
  )
}

/** 세로로 돌린 이름표(오른쪽 270° · 왼쪽 90°): 길이 len 의 가로 칸을 (cx, cy) 가운데로 돌린다. */
function Turned({ deg, cx, cy, len, h, children }: { deg: number; cx: number; cy: number; len: number; h: number; children: ReactNode }) {
  return (
    <div
      className="pf-abs"
      style={{ left: cx - len / 2, top: cy - h / 2, width: len, height: h, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `rotate(${deg}deg)` }}
    >
      {children}
    </div>
  )
}

// ── 가장자리: 손패 · 울기 ──

/** 울기 묶음. 가져온 패는 준 자리 쪽 칸에 눕힌다. 안깡은 양 끝을 덮는다. */
function MeldView({ m, seat, w }: { m: Meld; seat: number; w: number }) {
  const n = m.tiles.length
  const closed = m.from === null || m.from === undefined || m.from === seat
  // 준 자리가 왼쪽(상가)이면 첫 칸, 맞은편이면 가운데, 오른쪽(하가)이면 끝 칸.
  const rel = closed ? -1 : ((((m.from as number) - seat) % 4) + 4) % 4
  const lay = closed ? -1 : rel === 3 ? 0 : rel === 2 ? (n > 1 ? 1 : 0) : n - 1
  return (
    <span className="pf-row pf-meld" style={{ paddingLeft: w * 0.3 }}>
      {m.tiles.map((t, i) =>
        closed && n === 4 && (i === 0 || i === 3) ? (
          <span key={i} className="pf-cell" style={{ marginRight: w * 0.06 }}>
            <TileBack w={w} />
          </span>
        ) : (
          <span key={i} className="pf-cell" style={{ marginRight: w * 0.06 }}>
            {i === lay ? (
              <Laid w={w}>
                <Tile code={t} w={w} />
              </Laid>
            ) : (
              <Tile code={t} w={w} />
            )}
          </span>
        ),
      )}
    </span>
  )
}

/** 다른 자리의 가장자리 띠(아래 자리 기준으로 그리고 밖에서 돌린다). 손패는 뒷면, 끝 걸음의 화료자면 앞면. */
function SideStrip({ p, s, seat, w }: { p: PaifuRaw; s: PaifuState; seat: number; w: number }) {
  const tw = 0.62 * w
  const melds = meldsOf(p, s, seat)
  const r = p.result
  const open = s.finished && r && r.winner === seat && seat !== p.hero ? r.hand ?? null : null
  const won = open && r?.win_tile ? r.win_tile : null
  const count = Math.max(0, 13 - 3 * melds.length)
  return (
    <div className="pf-strip">
      <div className="pf-strip-hand">
        {open
          ? open.map((t, i) => (
              <span key={i} className="pf-cell" style={{ marginRight: tw * 0.06 }}>
                <Tile code={t} w={tw} />
              </span>
            ))
          : Array.from({ length: count }, (_, i) => (
              <span key={i} className="pf-cell" style={{ marginRight: tw * 0.06 }}>
                <TileBack w={tw} />
              </span>
            ))}
        {won && (
          <span className="pf-cell" style={{ marginLeft: tw * 0.3 }}>
            <Tile code={won} w={tw} highlight glow title={`화료패 ${tileInfo(won).name}`} />
          </span>
        )}
      </div>
      {melds.map((m, i) => (
        <MeldView key={i} m={m} seat={seat} w={tw} />
      ))}
    </div>
  )
}

/** hero 손패(앞면, 크게). 뽑은 패는 오른쪽에 떼어 둔다. 손패를 모르는 걸음은 뒷면. */
function HeroStrip({ p, s, w }: { p: PaifuRaw; s: PaifuState; w: number }) {
  const tw = 1.38 * w
  const seat = p.hero
  const melds = meldsOf(p, s, seat)
  const hand = s.heroHand
  const r = p.result
  const won = s.finished && r && r.winner === seat ? r.win_tile ?? null : null
  const face = (t: string, key: number | string, mark = false) => (
    <span key={key} className="pf-cell" style={{ marginRight: tw * 0.05 }}>
      <Tile code={t} w={tw} highlight={mark} glow={mark} />
    </span>
  )
  const backs = (n: number) =>
    Array.from({ length: n }, (_, i) => (
      <span key={`b${i}`} className="pf-cell" style={{ marginRight: tw * 0.05 }}>
        <TileBack w={tw} />
      </span>
    ))
  return (
    <div className="pf-hero">
      <div className="pf-hero-hand">
        <div className="pf-row" aria-label="손패">
          {hand ? hand.map((t, i) => face(t, i)) : backs(Math.max(0, 13 - 3 * melds.length))}
          {(s.hasDrawn || won) && <span style={{ width: tw * 0.35 }} />}
          {won ? face(won, 'won', true) : s.hasDrawn ? (s.drawn ? face(s.drawn, 'drawn', true) : backs(1)) : null}
        </div>
        {!hand && hasHeroHands(p) && (
          <span
            className="pf-nohand"
            style={{ bottom: tw * 0.5, fontSize: Math.max(0.4 * w, 9), padding: `${0.08 * w}px ${0.3 * w}px`, borderRadius: 0.2 * w }}
          >
            이 순의 손패는 기록에 없습니다
          </span>
        )}
      </div>
      {melds.map((m, i) => (
        <MeldView key={i} m={m} seat={seat} w={1.05 * w} />
      ))}
    </div>
  )
}
