// 앱의 점수 계산 · 패보 복기 엔진(Dart → JS, public/engine/mj_engine.js)을 패보 재생 화면에서만 불러 쓴다.
// 엔진 로직은 여기 없다 — 앱 저장소 tool/web_engine/engine_api.dart 가 앱 엔진을 부른 결과(JSON)를 받기만 한다.
// 만드는 법 · 원본 sha: scripts/build_engine.sh · public/engine/ENGINE_SOURCE.txt.
import { useEffect, useState } from 'react'
import { ENGINE_HASH } from './engineBuild'
import type { PaifuRaw } from './types'

/** 전역 mjEngine(web_engine.dart 가 만든다). */
export interface EngineApi {
  score(paifuJson: string): string
  review(paifuJson: string, options?: string): string
  version: string
  apiVersion: number
}

declare global {
  interface Window {
    mjEngine?: EngineApi
    mjEngineOnReady?: () => void
  }
}

/** 지금 웹이 읽을 줄 아는 출력 꼴 판(engine_api.dart engineApiVersion). */
const API_VERSION = 1

let loading: Promise<EngineApi> | null = null

/** 엔진 스크립트를 한 번만 불러온다. 실패하면 다음 호출 때 다시 시도한다. */
export function loadEngine(): Promise<EngineApi> {
  if (window.mjEngine) return Promise.resolve(window.mjEngine)
  if (loading) return loading
  loading = new Promise<EngineApi>((resolve, reject) => {
    const done = () => {
      const e = window.mjEngine
      if (!e) return false
      if (e.apiVersion !== API_VERSION) reject(new Error(`엔진 출력 꼴 판이 다릅니다(${e.apiVersion})`))
      else resolve(e)
      return true
    }
    window.mjEngineOnReady = () => void done()
    const s = document.createElement('script')
    s.src = `${import.meta.env.BASE_URL}engine/mj_engine.js?v=${ENGINE_HASH}`
    s.async = true
    s.onload = () => {
      if (!done()) reject(new Error('엔진을 읽었지만 mjEngine 이 없습니다'))
    }
    s.onerror = () => reject(new Error('엔진 스크립트를 불러오지 못했습니다'))
    document.head.appendChild(s)
  }).catch((e: unknown) => {
    loading = null
    throw e
  })
  return loading
}

// ── 출력 꼴(engine_api.dart 와 같은 이름) ──

export interface ScoreYaku {
  name: string
  han: number
  yakuman: boolean
  label: string
}

export interface ScoreDetail {
  valid: boolean
  error: string | null
  yaku: ScoreYaku[]
  han: number
  fu: number
  fuItems: { label: string; fu: number }[]
  limit: string
  limitLabel: string
  yakuman: boolean
  yakumanCount: number
  stamp: string
  summary: string
  hanFu: string
  basePoints: number
  payment: {
    ron: number
    tsumoFromDealer: number
    tsumoFromNonDealer: number
    total: number
    honba: number
    display: string
    honbaNote: string
  }
  paymentLine: string
  situation: {
    isTsumo: boolean
    isDealer: boolean
    seatWind: string
    roundWind: string
    riichi: boolean
    doubleRiichi: boolean
    ippatsu: boolean
    lastTile: boolean
    rinshan: boolean
    chankan: boolean
    firstTurnWin: boolean
    doraIndicators: string[]
    uraIndicators: string[]
    honba: number
  }
  hand: { closed: string[]; winTile: string; melds: { kind: string; tiles: string[] }[] }
}

export interface ScoreOut {
  kind: 'none' | 'draw' | 'win'
  result?: { type: string; winner: number | null; loser: number | null; winTile: string | null; tenpai?: number[] }
  score?: ScoreDetail | null
  rules: Record<string, boolean | number>
}

export type GradeKey = 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder'

export interface ReviewOption {
  tile: string
  name: string
  shanten: number
  shantenText: string
  word: string
  ukeire: number
  ukeireTiles: { tile: string; left: number }[]
  actual: boolean
  best: boolean
  info: string | null
}

export interface ReviewTurn {
  step: number
  eventIndex: number
  turn: number
  discard: string
  discardName: string
  drawn: string | null
  tsumogiri: boolean | null
  riichiDeclared: boolean
  status: 'graded' | 'forced' | 'defense' | 'complete' | 'unknownHand' | 'inconsistent' | 'guessed'
  statusName: string
  grade: GradeKey | null
  gradeName: string | null
  glyph: string | null
  badge: string | null
  melds: number
  shantenBefore: number | null
  shantenLoss: number | null
  ukeireLoss: number | null
  rank: number | null
  riichiSeats: number[]
  genbutsu: boolean | null
  safeTiles: string[]
  title: string
  corner: string | null
  lines: string[]
  sentence: string
  bestTiles: string[]
  bestLabel: string
  actual: ReviewOption | null
  best: ReviewOption | null
  candidates: ReviewOption[]
  options: ReviewOption[]
}

export interface ReviewSummary {
  hasHeroHands: boolean
  hasNumbers: boolean
  head: string
  result: string
  turns: number
  graded: number
  efficiencyPct: number | null
  evaluatedText: string
  noteText: string
  thresholds: { goodPct: number; inaccuracyPct: number }
  thresholdText: string
  grades: { grade: GradeKey; name: string; glyph: string; count: number }[]
  skip: { forced: number; defense: number; complete: number; handUnknown: number }
  skipText: string
  lessons: { step: number; turn: number; discard: string; text: string; grade: GradeKey; gradeName: string; glyph: string; loss: string }[]
  noLessonText: string
  flaggedSteps: number[]
}

export interface ReviewOut {
  summary: ReviewSummary
  turns: ReviewTurn[]
  stages: { step: number; kind: 'start' | 'riichi' | 'end'; name: string; sentence: string }[]
}

export interface EngineResult {
  version: string
  score: ScoreOut | null
  review: ReviewOut | null
  /** 걸음 → 그 걸음의 내 버림 평가. */
  byStep: Map<number, ReviewTurn>
}

export type EngineState = { status: 'loading' } | { status: 'failed'; error: string } | ({ status: 'ready' } & EngineResult)

function parse<T>(s: string): T | null {
  const v = JSON.parse(s) as unknown
  if (v && typeof v === 'object' && 'error' in v) {
    console.warn('엔진 오류:', (v as { error: unknown }).error)
    return null
  }
  return v as T
}

/** 패보 한 판의 점수 · 복기. 엔진을 못 불러오면 failed(화면은 엔진 칸만 숨긴다). */
export function useEngine(p: PaifuRaw, seatLabels: string[]): EngineState {
  const [state, setState] = useState<EngineState>({ status: 'loading' })
  const labels = seatLabels.join('\u0000')
  useEffect(() => {
    let alive = true
    setState({ status: 'loading' })
    loadEngine()
      .then((eng) => {
        if (!alive) return
        const json = JSON.stringify(p)
        const score = parse<ScoreOut>(eng.score(json))
        const review = parse<ReviewOut>(eng.review(json, JSON.stringify({ seatLabels: labels.split('\u0000') })))
        const byStep = new Map<number, ReviewTurn>((review?.turns ?? []).map((t) => [t.step, t]))
        setState({ status: 'ready', version: eng.version, score, review, byStep })
      })
      .catch((e: unknown) => {
        if (!alive) return
        console.warn('엔진을 쓰지 않습니다:', e)
        setState({ status: 'failed', error: String(e) })
      })
    return () => {
      alive = false
    }
  }, [p, labels])
  return state
}

/** 등급 배지 색(배경, 글자) — 앱 review_view.dart gradeColors 와 같다. */
export const GRADE_COLORS: Record<GradeKey, [string, string]> = {
  best: ['#2E7D32', '#ffffff'],
  good: ['#7CB342', '#000000'],
  inaccuracy: ['#FBC02D', '#000000'],
  mistake: ['#F57C00', '#000000'],
  blunder: ['#C62828', '#ffffff'],
}
