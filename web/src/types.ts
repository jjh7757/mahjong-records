// 서버 응답 꼴(app/api.py).

export interface Member {
  name: string
  games: number
  total: number
  avg_rank: number
  rank_counts: number[]
  top_rate: number
  top2_rate: number
  last_rate: number
  busts: number
  stars: number
  avg_stars: number
  best: number | null
}

export interface Player {
  seat: number
  name: string
  final_points: number
  rank: number
  score: number
  stars: number
  bust: boolean
}

export interface GameSummary {
  id: number
  started_at: string
  ended_by: string | null
  manual: boolean
  east_only: boolean
  finished: boolean
  paifu_count: number
  /** 다른 사이트에서 가져온 대국의 출처('mavely' 등). 앱이 올린 대국은 null. */
  source: string | null
  players: Player[]
}

export interface GameEventRow {
  seq: number
  kind: string
  round: string
  description: string
  delta: number[]
  stars: number[] | null
}

export interface GameSettings {
  startPoints?: number
  returnPoints?: number
  umaBig?: number
  umaSmall?: number
  eastOnly?: boolean
  roundingMode?: number
  source?: string
  season?: string
}

// ---- 패보(앱 lib/paifu/paifu.dart, version 1) ----

export interface PaifuEventRaw {
  type: 'draw' | 'discard' | 'call'
  seat: number
  tile?: string | null
  tsumogiri?: boolean | null
  riichi?: boolean
  hand?: string[] | null
  kind?: string | null
  from?: number | null
  tiles?: string[]
  guess?: boolean
}

export interface PaifuResultRaw {
  type: 'ron' | 'tsumo' | 'draw' | string
  winner?: number | null
  loser?: number | null
  win_tile?: string | null
  hand?: string[] | null
  melds?: ({ kind?: string; tiles?: string[] } | string[])[]
  flags?: Record<string, boolean>
  tenpai?: number[]
}

export interface PaifuRaw {
  version?: number
  id?: string
  title?: string
  round?: string
  honba?: number
  dealer?: number
  hero: number
  names?: string[]
  dora_indicators?: string[]
  ura_indicators?: string[]
  note?: string
  start_hand?: string[]
  start_scores?: number[]
  kyotaku?: number
  events?: PaifuEventRaw[]
  result?: PaifuResultRaw | null
}

export interface PaifuRound {
  seq: number
  paifu_id: string
  round: string
  honba: number
  dealer: number
  hero: number
  result_type: string | null
  winner: number | null
  loser: number | null
  raw: PaifuRaw
}

export interface GameDetail {
  id: number
  started_at: string
  finished: boolean
  ended_by: string | null
  manual: boolean
  east_only: boolean
  settings: GameSettings
  store: string
  source: string | null
  uploaded_at: string
  updated_at: string
  app_version: string | null
  players: Player[]
  events: GameEventRow[]
  paifu: PaifuRound[]
}

export interface Overview {
  games: number
  members: number
  paifu_rounds: number
  first_game_at: string | null
  last_game_at: string | null
  monthly: { month: string; games: number }[]
  hands: { total: number; win: number; draw: number; win_rate: number | null; draw_rate: number | null }
}

export interface Page<T> {
  page: number
  page_size: number
  total: number
  items: T[]
}
