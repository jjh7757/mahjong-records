const TZ = 'Asia/Seoul'

const dateFmt = new Intl.DateTimeFormat('ko-KR', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' })
const dateTimeFmt = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TZ,
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
const isoDay = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })

export const fmtDate = (iso: string) => dateFmt.format(new Date(iso))
const mdFmt = new Intl.DateTimeFormat('ko-KR', { timeZone: TZ, month: 'numeric', day: 'numeric' })
export const fmtMonthDay = (iso: string) => mdFmt.format(new Date(iso))
export const fmtDateTime = (iso: string) => dateTimeFmt.format(new Date(iso))

/** 오늘(서울) YYYY-MM-DD */
export const todayIso = () => isoDay.format(new Date())

export const fmtPoints = (n: number) => n.toLocaleString('ko-KR')

export const fmtScore = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(1)}`

export const fmtDelta = (n: number) => (n === 0 ? '' : `${n > 0 ? '+' : '−'}${Math.abs(n).toLocaleString('ko-KR')}`)

export const fmtPct = (r: number, digits = 1) => `${(r * 100).toFixed(digits)}%`

export const scoreClass = (n: number) => (n > 0 ? 'pos' : n < 0 ? 'neg' : '')

export const WINDS = ['동', '남', '서', '북']

/** 자리별 고정 색(그래프 · 이름 표시). CSS 변수 --seat0..3 */
export const seatColor = (seat: number) => `var(--seat${seat})`
