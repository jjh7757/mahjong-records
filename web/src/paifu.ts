// 패보 재생 상태 만들기. 앱 lib/paifu/paifu.dart 의 Paifu._build 를 옮긴 것.
import type { PaifuEventRaw, PaifuRaw } from './types'

export interface RiverTile {
  tile: string
  tsumogiri: boolean | null
  riichi: boolean
  called: boolean
}

export interface Meld {
  kind: string
  tiles: string[]
  from: number | null
}

export interface PaifuState {
  step: number
  rivers: RiverTile[][]
  melds: Meld[][]
  riichi: boolean[]
  heroHand: string[] | null
  hasDrawn: boolean
  drawn: string | null
  event: PaifuEventRaw | null
  finished: boolean
  draws: number
}

export function buildStates(p: PaifuRaw): PaifuState[] {
  const events = p.events ?? []
  const hero = p.hero
  const rivers: RiverTile[][] = [[], [], [], []]
  const melds: Meld[][] = [[], [], [], []]
  const riichi = [false, false, false, false]
  let hand: string[] | null = p.start_hand ?? null
  let hasDrawn = false
  let drawn: string | null = null
  let draws = 0
  let afterOpenCall = false

  const snap = (step: number, e: PaifuEventRaw | null, finished = false): PaifuState => ({
    step,
    rivers: rivers.map((r) => r.slice()),
    melds: melds.map((m) => m.slice()),
    riichi: riichi.slice(),
    heroHand: hand,
    hasDrawn,
    drawn,
    event: e,
    finished,
    draws,
  })

  const out: PaifuState[] = [snap(0, null)]
  events.forEach((e, i) => {
    if (e.type === 'draw') {
      if (e.seat === hero) {
        draws++
        hand = e.hand ?? null
        hasDrawn = true
        drawn = e.tile ?? null
      }
    } else if (e.type === 'discard') {
      rivers[e.seat].push({ tile: e.tile ?? '?', tsumogiri: e.tsumogiri ?? null, riichi: !!e.riichi, called: false })
      if (e.riichi) riichi[e.seat] = true
      if (e.seat === hero) {
        if (!hasDrawn && !afterOpenCall) draws++
        hand = e.hand ?? null
        hasDrawn = false
        drawn = null
      } else if (!afterOpenCall) {
        draws++
      }
      afterOpenCall = false
    } else if (e.type === 'call') {
      const from = e.from ?? null
      if (from !== null && from !== e.seat && rivers[from].length > 0) {
        const r = rivers[from]
        r[r.length - 1] = { ...r[r.length - 1], called: true }
      }
      const kind = e.kind ?? 'pon'
      const tiles = e.tiles ?? []
      const meld: Meld = { kind, tiles, from }
      const pon =
        kind === 'kakan' && tiles.length > 0
          ? melds[e.seat].findIndex((m) => m.kind === 'pon' && sameTile(m.tiles[0], tiles[0]))
          : -1
      if (pon >= 0) melds[e.seat][pon] = meld
      else melds[e.seat].push(meld)
      afterOpenCall = !kind.includes('kan')
      if (e.seat === hero) {
        hand = e.hand ?? null
        hasDrawn = false
        drawn = null
      }
    }
    out.push(snap(i + 1, e))
  })
  const r = p.result
  if (r) {
    if (r.winner === hero && r.hand) hand = r.hand
    hasDrawn = false
    drawn = null
    out.push(snap(events.length + 1, null, true))
  }
  return out
}

/** hero 가 뽑은 걸음들(없으면 버린 걸음들) — "다음 내 차례" 이동. */
export function heroTurnSteps(p: PaifuRaw, states: PaifuState[]): number[] {
  const of = (type: string) =>
    states.filter((s) => s.event && s.event.type === type && s.event.seat === p.hero).map((s) => s.step)
  const d = of('draw')
  return d.length ? d : of('discard')
}

export const wallLeft = (s: PaifuState) => Math.max(0, Math.min(70, 70 - s.draws))

// ---- 패 코드 ----

export type Suit = 'm' | 'p' | 's' | 'z'
export const HONORS = ['동', '남', '서', '북', '백', '발', '중']
const SUIT_NAME: Record<string, string> = { m: '만', p: '통', s: '삭' }

export interface TileInfo {
  suit: Suit | null
  num: number // 적5 는 5
  red: boolean
  label: string // 큰 글자
  sub: string // 작은 글자(수트)
  name: string // 읽기용
}

export function tileInfo(code: string | null | undefined): TileInfo {
  const c = (code ?? '').trim()
  const m = /^([0-9])([mpsz])$/.exec(c)
  if (!m) return { suit: null, num: 0, red: false, label: '?', sub: '', name: '모르는 패' }
  const suit = m[2] as Suit
  const raw = Number(m[1])
  if (suit === 'z') {
    const h = HONORS[raw - 1] ?? '?'
    return { suit, num: raw, red: false, label: h, sub: '', name: h }
  }
  const red = raw === 0
  const num = red ? 5 : raw
  return { suit, num, red, label: String(num), sub: SUIT_NAME[suit], name: `${red ? '적' : ''}${num}${SUIT_NAME[suit]}` }
}

export function sameTile(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false
  const n = (x: string) => (x[0] === '0' ? '5' + x[1] : x)
  return n(a) === n(b)
}

const SUIT_ORDER: Record<string, number> = { m: 0, p: 1, s: 2, z: 3 }
export function sortTiles(ts: string[]): string[] {
  const key = (t: string) => {
    const i = tileInfo(t)
    return (SUIT_ORDER[i.suit ?? 'z'] ?? 4) * 20 + i.num * 2 + (i.red ? 1 : 0)
  }
  return ts.slice().sort((a, b) => key(a) - key(b))
}

export const CALL_NAME: Record<string, string> = {
  pon: '퐁',
  chi: '치',
  kan: '깡',
  ankan: '안깡',
  kakan: '가깡',
  minkan: '대명깡',
  call: '울기',
}

export const RESULT_NAME: Record<string, string> = { ron: '론', tsumo: '쯔모', draw: '유국' }
