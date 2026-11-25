// 패보 재생 화면의 엔진 칸: 등급 배지 · 수 평가 카드 · 단계 카드 · 점수 결과 · 판 요약.
// 글과 숫자는 모두 앱 엔진(engine.ts → mj_engine.js)이 낸 것 그대로 — 여기서는 그리기만 한다.
// 모양은 앱 lib/ui/paifu/review_view.dart(ReviewBadge · ReviewGradeIcon · ReviewBubble · ReviewCandidates),
// review_summary_view.dart(판 요약), lib/ui/result_screen.dart(점수 결과)를 따른다.
import { useEffect, useRef } from 'react'
import { GRADE_COLORS, type GradeKey, type ReviewSummary, type ReviewTurn, type ScoreDetail } from '../engine'
import { Tile } from './Tile'

/** 등급 색 동그라미 + 모양(색만으로 가르지 않음 — 앱 ReviewGradeIcon). */
export function GradeIcon({ grade, glyph, name, size = 20 }: { grade: GradeKey; glyph: string; name?: string; size?: number }) {
  const [bg, fg] = GRADE_COLORS[grade]
  return (
    <span
      className="eg-icon"
      role="img"
      aria-label={name ?? glyph}
      title={name}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: glyph.length > 1 ? size * 0.5 : size * 0.62, borderWidth: Math.max(1, size * 0.06) }}
    >
      {glyph}
    </span>
  )
}

/** 걸음 목록 옆 작은 배지: 등급 · 수비 · 화료 형태(앱 ReviewBadge). 그 밖은 그리지 않는다. */
export function ReviewBadge({ t }: { t: ReviewTurn }) {
  if (!t.badge) return null
  if (t.status === 'graded' && t.grade) {
    const [bg, fg] = GRADE_COLORS[t.grade]
    return (
      <span className="eg-badge" style={{ background: bg, color: fg }}>
        {t.badge}
      </span>
    )
  }
  return <span className={`eg-badge ${t.status === 'defense' ? 'def' : 'done'}`}>{t.badge}</span>
}

/** 내 버림 걸음의 평가 카드(앱 ReviewBubble.turn + ReviewCandidates). */
export function TurnCard({ t }: { t: ReviewTurn }) {
  const graded = t.status === 'graded' && t.grade && t.glyph
  return (
    <section className="eg-card" aria-label="이 버림 평가">
      <div className="eg-card-head">
        {graded && <GradeIcon grade={t.grade!} glyph={t.glyph!} name={t.gradeName ?? undefined} size={22} />}
        <b className="eg-card-title">{t.title}</b>
        {t.corner && <span className="eg-corner">{t.corner}</span>}
      </div>
      {t.lines.map((l) => (
        <p key={l} className="eg-line">
          {l}
        </p>
      ))}
      <p className="eg-sentence">{t.sentence}</p>
      {t.candidates.length > 0 && (
        <div className="eg-cands" aria-label="후보">
          <span className="eg-cands-h">후보</span>
          {t.candidates.map((o) => (
            <div key={o.tile} className={`eg-cand${o.actual ? ' actual' : ''}`} title={o.info ?? undefined}>
              <Tile code={o.actual ? t.discard : o.tile} w={18} highlight={o.actual} />
              <span className="eg-cand-t">
                {o.shantenText} · {o.word} {o.ukeire}장
              </span>
              {o.actual && <span className="eg-tag actual">실제</span>}
              {o.best && <span className="eg-tag best">최선</span>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

/** 단계 걸음(배패 · 리치 · 끝) 카드 — 그 걸음에 내 버림 평가가 없을 때(앱 ReviewBubble.stage). */
export function StageCard({ name, sentence }: { name: string; sentence: string }) {
  return (
    <section className="eg-card stage" aria-label={name}>
      <div className="eg-card-head">
        <b className="eg-card-title">{name}</b>
      </div>
      {sentence.split('\n').map((l) => (
        <p key={l} className="eg-sentence">
          {l}
        </p>
      ))}
    </section>
  )
}

const MELD_NAME: Record<string, string> = { chi: '치', pon: '퐁', kan: '깡', ankan: '안깡' }

/** 점수 결과(앱 ResultScreen 의 보기 전용 몫): 손패 · 역 · 판 부 · 도장 · 점수 · 지불 · 부수. */
export function ScoreDialog({ s, who, onClose }: { s: ScoreDetail; who: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', on, true)
    return () => {
      window.removeEventListener('keydown', on, true)
      prev?.focus?.()
    }
  }, [onClose])
  const sit = s.situation
  return (
    <div className="eg-backdrop" onClick={onClose}>
      <div
        className="eg-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="점수 결과"
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="eg-dialog-head">
          <b>점수 결과</b>
          <span className="eg-muted">{who}</span>
          <button type="button" className="eg-close" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>
        <div className="eg-hand" aria-label="화료 손패">
          {s.hand.closed.map((c, i) => (
            <Tile key={i} code={c} w={24} />
          ))}
          <span className="eg-gap" />
          <Tile code={s.hand.winTile} w={24} highlight title={`화료패`} />
          {s.hand.melds.map((m, i) => (
            <span key={i} className="eg-meld" title={MELD_NAME[m.kind] ?? m.kind}>
              {m.tiles.map((c, j) => (
                <Tile key={j} code={c} w={22} />
              ))}
            </span>
          ))}
        </div>
        <p className="eg-muted eg-sit">
          {sit.roundWind}장 · {sit.seatWind}가{sit.isDealer ? '(친)' : ''} · {sit.isTsumo ? '쯔모' : '론'}
          {sit.doraIndicators.length > 0 && ` · 도라 표시패 ${sit.doraIndicators.length}장`}
          {sit.uraIndicators.length > 0 && ` · 뒷도라 표시패 ${sit.uraIndicators.length}장`}
        </p>
        <ul className="eg-yaku">
          {s.yaku.map((y) => (
            <li key={y.name}>
              <span>{y.name}</span>
              <b>{y.label}</b>
            </li>
          ))}
        </ul>
        <div className="eg-hanfu">
          <b>{s.hanFu}</b>
          {s.stamp && <span className="eg-stamp">{s.stamp}</span>}
        </div>
        <p className="eg-points">{s.payment.total}점</p>
        <p className="eg-pay">{s.paymentLine}</p>
        {!s.yakuman && s.fuItems.length > 0 && (
          <details className="eg-fu">
            <summary>부수</summary>
            <ul>
              {s.fuItems.map((f, i) => (
                <li key={i}>
                  <span>{f.label}</span>
                  <span>{f.fu}부</span>
                </li>
              ))}
              <li className="sum">
                <span>합계</span>
                <span>{s.fu}부</span>
              </li>
            </ul>
          </details>
        )}
        <p className="eg-muted eg-rules">룰: 앱 기본값(쿠이탄 · 적도라 있음, 끌어올림 만관 없음). 앱에서 룰을 바꿨다면 점수가 다를 수 있습니다.</p>
      </div>
    </div>
  )
}

/** 판 요약(앱 PaifuReviewSummary): 접힌 줄에 패효율 · 등급 개수, 펼치면 평가 안 함 · 배울 장면 · 임시 기준 문구. */
export function SummaryCard({ s, onLesson }: { s: ReviewSummary; onLesson: (step: number) => void }) {
  return (
    <details className="eg-summary">
      <summary>
        <span className="eg-sum-title">복기 요약</span>
        <span className="eg-pct" aria-label="패효율">
          패효율 <b>{s.efficiencyPct ?? '—'}</b>
        </span>
        <span className="eg-sum-grades">
          {s.grades.map((g) => (
            <span key={g.grade} className={g.count === 0 ? 'zero' : ''}>
              <GradeIcon grade={g.grade} glyph={g.glyph} name={g.name} size={18} />
              {g.count}
            </span>
          ))}
        </span>
      </summary>
      <div className="eg-sum-body">
        <p>{s.evaluatedText}</p>
        <p>{s.noteText}</p>
        <p className="eg-muted">{s.thresholdText}</p>
        <table className="eg-grade-table">
          <tbody>
            {s.grades.map((g) => (
              <tr key={g.grade} className={g.count === 0 ? 'zero' : ''}>
                <th scope="row">{g.name}</th>
                <td>
                  <GradeIcon grade={g.grade} glyph={g.glyph} name={g.name} size={22} />
                </td>
                <td className="n">{g.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="eg-muted">
          <span className="eg-skip-h">평가 안 함</span> {s.skipText}
        </p>
        <h3>배울 장면</h3>
        {s.lessons.length === 0 ? (
          <p>{s.noLessonText}</p>
        ) : (
          <ul className="eg-lessons">
            {s.lessons.map((l) => (
              <li key={l.step}>
                <button type="button" onClick={() => onLesson(l.step)}>
                  <GradeIcon grade={l.grade} glyph={l.glyph} name={l.gradeName} size={20} />
                  <span className="t">{l.text}</span>
                  <span className="loss">{l.loss}</span>
                  <span aria-hidden>›</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  )
}
