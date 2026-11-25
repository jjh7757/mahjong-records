// 패를 글자 칩으로 그린다(그림 파일을 쓰지 않음).
import { tileInfo } from '../paifu'

interface Props {
  code: string | null | undefined
  size?: 'sm' | 'md'
  dim?: boolean
  sideways?: boolean
  called?: boolean
  highlight?: boolean
  title?: string
}

export function Tile({ code, size = 'md', dim, sideways, called, highlight, title }: Props) {
  const t = tileInfo(code)
  const cls = [
    'tile',
    `tile-${size}`,
    t.suit ? `suit-${t.suit}` : 'suit-x',
    t.suit === 'z' ? `honor-${t.num}` : '',
    t.red ? 'red5' : '',
    dim ? 'dim' : '',
    sideways ? 'sideways' : '',
    called ? 'called' : '',
    highlight ? 'hl' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const label = title ?? [t.name, sideways ? '리치 선언' : '', dim ? '쯔모기리' : '', called ? '울려 감' : ''].filter(Boolean).join(' · ')
  return (
    <span className={cls} title={label} aria-label={label} role="img">
      <span className="tile-num">{t.label}</span>
      {t.sub && <span className="tile-suit">{t.sub}</span>}
    </span>
  )
}

export function TileRow({ tiles, size = 'md' }: { tiles: string[]; size?: 'sm' | 'md' }) {
  return (
    <span className="tile-row">
      {tiles.map((t, i) => (
        <Tile key={i} code={t} size={size} />
      ))}
    </span>
  )
}
