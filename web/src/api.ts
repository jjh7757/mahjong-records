import { useCallback, useEffect, useState } from 'react'

const API = `${import.meta.env.BASE_URL}api`

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function handle<T>(r: Response): Promise<T> {
  if (r.ok) return (await r.json()) as T
  let msg = `요청 실패 (${r.status})`
  try {
    const j = await r.json()
    if (typeof j?.detail === 'string') msg = j.detail
  } catch {
    /* 본문이 JSON 이 아님 */
  }
  throw new ApiError(r.status, msg)
}

export function apiGet<T>(path: string, params?: Record<string, string | number | undefined | null>): Promise<T> {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params ?? {})) if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
  const qs = q.toString()
  return fetch(`${API}${path}${qs ? `?${qs}` : ''}`, { credentials: 'same-origin' }).then((r) => handle<T>(r))
}

// 쓰기 요청은 X-Requested-With 를 붙인다(서버가 CSRF 막기로 확인).
export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return fetch(`${API}${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then((r) => handle<T>(r))
}

export interface Loaded<T> {
  data: T | null
  error: string | null
  loading: boolean
  reload: () => void
}

/** 경로 · 매개변수가 바뀔 때마다 다시 받는다. key 는 의존성 문자열. */
export function useApi<T>(path: string | null, params?: Record<string, string | number | undefined | null>): Loaded<T> {
  const key = path === null ? null : `${path}?${JSON.stringify(params ?? {})}`
  const [state, setState] = useState<{ key: string | null; data: T | null; error: string | null }>({
    key: null,
    data: null,
    error: null,
  })
  const [tick, setTick] = useState(0)
  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (path === null) return
    let alive = true
    apiGet<T>(path, params)
      .then((data) => alive && setState({ key, data, error: null }))
      .catch((e: unknown) => alive && setState({ key, data: null, error: e instanceof Error ? e.message : String(e) }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick])

  const fresh = state.key === key
  return {
    data: fresh ? state.data : null,
    error: fresh ? state.error : null,
    loading: path !== null && !fresh,
    reload,
  }
}
