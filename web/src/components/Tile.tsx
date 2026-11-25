// 패 한 장. 그림은 public/tiles/(앱 assets/tiles 와 같은 CC0 패 세트, LICENSE.md 함께).
// 패 몸통(크림색 면 + 아래 두께)은 앱 TileView 처럼 직접 그리고, 그림은 그 안에 넣는다.
import type { CSSProperties, ReactNode } from 'react'
import { tileInfo } from '../paifu'

const TILE_DIR = `${import.meta.env.BASE_URL}tiles/`

interface Props {
  code: string | null | undefined
  /** 패 너비(px). 높이는 1.4배. */
  w: number
  /** 테두리(방금 버린 패 · 뽑은 패 · 화료패). */
  highlight?: boolean
  /** 금색 빛(방금 움직인 패). */
  glow?: boolean
  /** 쯔모기리: 어둡게 덮는다. */
  dim?: boolean
  title?: string
}

export function Tile({ code, w, highlight, glow, dim, title }: Props) {
  const t = tileInfo(code)
  const bw = highlight ? Math.max(1.5, Math.min(2.5, w * 0.08)) : 1
  const style: CSSProperties = {
    width: w,
    height: w * 1.4,
    borderRadius: w * 0.14,
    borderWidth: bw,
    boxShadow: glow ? `0 0 ${w * 0.22}px ${w * 0.07}px var(--pf-gold), 0 1px 2px rgba(0,0,0,.2)` : undefined,
  }
  const label = title ?? [t.name, dim ? '쯔모기리' : ''].filter(Boolean).join(' · ')
  return (
    <span className={`pf-tile${highlight ? ' hl' : ''}${dim ? ' dim' : ''}`} style={style} title={label} role="img" aria-label={label}>
      {t.suit ? (
        <img
          src={`${TILE_DIR}${(code ?? '').trim()}.png`}
          alt=""
          draggable={false}
          decoding="async"
          style={{ left: w * 0.1 - bw, top: w * 0.12 - bw, width: w * 0.8, height: w * 1.08 }}
        />
      ) : (
        <span className="pf-tile-q" style={{ fontSize: w * 0.6 }}>
          ?
        </span>
      )}
    </span>
  )
}

/** 뒷면(남의 손패 · 모르는 패 · 안깡 양 끝). */
export function TileBack({ w }: { w: number }) {
  return <span className="pf-back" style={{ width: w, height: w * 1.4, borderRadius: w * 0.14 }} aria-hidden />
}

/** 눕힌 패(리치 선언 · 울기로 가져온 패): 시계 방향 90°, 차지하는 칸도 가로 1.4w × 세로 w. */
export function Laid({ w, children }: { w: number; children: ReactNode }) {
  return (
    <span className="pf-laid" style={{ width: w * 1.4, height: w }}>
      <span style={{ left: w * 0.2, top: -w * 0.2 }}>{children}</span>
    </span>
  )
}
