import { useState, type FormEvent } from 'react'
import { apiPost, useApi } from '../api'
import { Pager, Status } from '../components/common'
import { fmtDateTime } from '../format'
import { Link, gamePath } from '../router'
import type { Page } from '../types'

interface Me {
  admin: boolean
  configured: boolean
}
interface Store {
  id: number
  name: string
  created_at: string
  revoked_at: string | null
  games: number
  last_upload_at: string | null
}
interface AdminGame {
  id: number
  started_at: string
  hidden: boolean
  store: string
  client_game_id: string
  players: string
}

export function AdminPage() {
  const me = useApi<Me>('/admin/me')
  if (!me.data) return <Status loading={me.loading} error={me.error} onRetry={me.reload} />
  if (!me.data.configured)
    return (
      <section className="card">
        <h1>관리자</h1>
        <p>서버에 관리자 비밀번호(ADMIN_PASSWORD_HASH)와 세션 키(SESSION_SECRET)가 설정되지 않았습니다.</p>
      </section>
    )
  return me.data.admin ? <AdminHome onLogout={me.reload} /> : <Login onDone={me.reload} />
}

function Login({ onDone }: { onDone: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const password = String(new FormData(e.currentTarget).get('password') || '')
    setBusy(true)
    setError(null)
    try {
      await apiPost('/admin/login', { password })
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <section className="card narrow">
      <h1>관리자 로그인</h1>
      <form onSubmit={submit} className="stack">
        <label>
          비밀번호
          <input type="password" name="password" autoComplete="current-password" required autoFocus />
        </label>
        <button className="btn primary" disabled={busy}>
          {busy ? '확인 중…' : '로그인'}
        </button>
        {error && (
          <p className="status error" role="alert">
            {error}
          </p>
        )}
      </form>
      <p className="hint">5번 틀리면 15분 동안 잠깁니다.</p>
    </section>
  )
}

function AdminHome({ onLogout }: { onLogout: () => void }) {
  const logout = async () => {
    await apiPost('/admin/logout').catch(() => undefined)
    onLogout()
  }
  return (
    <>
      <div className="page-head row">
        <h1>관리자</h1>
        <button className="btn small" onClick={logout}>
          로그아웃
        </button>
      </div>
      <Stores />
      <Games />
    </>
  )
}

function Stores() {
  const list = useApi<{ stores: Store[] }>('/admin/stores')
  const [issued, setIssued] = useState<{ name: string; key: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = String(new FormData(form).get('name') || '').trim()
    if (!name) return
    setError(null)
    try {
      const r = await apiPost<{ name: string; key: string }>('/admin/stores', { name })
      setIssued(r)
      setCopied(false)
      form.reset()
      list.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }
  const revoke = async (s: Store) => {
    if (!window.confirm(`'${s.name}' 매장 키를 폐기할까요? 이 키로는 더 올릴 수 없고, 되돌릴 수 없습니다.`)) return
    try {
      await apiPost(`/admin/stores/${s.id}/revoke`)
      list.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }
  const copy = async () => {
    if (!issued) return
    try {
      await navigator.clipboard.writeText(issued.key)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="card">
      <div className="card-head">
        <h2>매장 키</h2>
      </div>
      <form onSubmit={create} className="inline-form">
        <input name="name" placeholder="매장 이름(예: 본점 태블릿)" maxLength={100} required aria-label="매장 이름" />
        <button className="btn primary">키 발급</button>
      </form>
      {issued && (
        <div className="issued" role="status">
          <p>
            <b>{issued.name}</b> 키 — <strong>이 화면을 떠나면 다시 볼 수 없습니다.</strong> 태블릿 앱 설정의 "기록 사이트" 칸에 넣으세요.
          </p>
          <code className="key">{issued.key}</code>
          <div className="row">
            <button className="btn small" onClick={copy}>
              {copied ? '복사함' : '복사'}
            </button>
            <button className="btn small" onClick={() => setIssued(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
      {error && <p className="status error">{error}</p>}
      <Status loading={list.loading} error={list.error} />
      {list.data && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>만든 때</th>
                <th className="num">대국</th>
                <th>마지막 올림</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.data.stores.map((s) => (
                <tr key={s.id} className={s.revoked_at ? 'muted' : ''}>
                  <td>{s.name}</td>
                  <td>{fmtDateTime(s.created_at)}</td>
                  <td className="num">{s.games}</td>
                  <td>{s.last_upload_at ? fmtDateTime(s.last_upload_at) : '–'}</td>
                  <td>
                    {s.revoked_at ? (
                      <span className="tag muted">폐기 {fmtDateTime(s.revoked_at)}</span>
                    ) : (
                      <button className="btn small danger" onClick={() => revoke(s)}>
                        폐기
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {list.data.stores.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    발급한 키가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function Games() {
  const [page, setPage] = useState(1)
  const list = useApi<Page<AdminGame>>('/admin/games', { page })
  const [error, setError] = useState<string | null>(null)
  const toggle = async (g: AdminGame) => {
    setError(null)
    try {
      await apiPost(`/admin/games/${g.id}/${g.hidden ? 'unhide' : 'hide'}`)
      list.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }
  return (
    <section className="card">
      <div className="card-head">
        <h2>대국 숨기기</h2>
      </div>
      <p className="hint">숨긴 대국은 목록 · 순위표에서 빠지고 지워지지는 않습니다.</p>
      {error && <p className="status error">{error}</p>}
      <Status loading={list.loading} error={list.error} />
      {list.data && (
        <>
          <ul className="admin-games">
            {list.data.items.map((g) => (
              <li key={g.id} className={g.hidden ? 'muted' : ''}>
                <div>
                  <span className="ag-date">{fmtDateTime(g.started_at)}</span>
                  <span className="ag-store">{g.store}</span>
                  {g.hidden ? <span className="tag muted">숨김</span> : <Link to={gamePath(g.id)}>보기</Link>}
                </div>
                <div className="ag-players">{g.players}</div>
                <button className={`btn small ${g.hidden ? '' : 'danger'}`} onClick={() => toggle(g)}>
                  {g.hidden ? '다시 보이기' : '숨기기'}
                </button>
              </li>
            ))}
          </ul>
          <Pager page={page} total={list.data.total} size={list.data.page_size} onPage={setPage} />
        </>
      )}
    </section>
  )
}
