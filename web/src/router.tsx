// 작은 라우터(의존성 없이). 앱 경로는 BASE('/records/') 뒤의 부분.
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'

const BASE = import.meta.env.BASE_URL

export interface Route {
  segments: string[]
  query: URLSearchParams
}

function current(): Route {
  let p = window.location.pathname
  if (p.startsWith(BASE)) p = p.slice(BASE.length)
  else if (p + '/' === BASE) p = ''
  const segments = p
    .split('/')
    .filter(Boolean)
    .map((s) => {
      try {
        return decodeURIComponent(s)
      } catch {
        return s
      }
    })
  return { segments, query: new URLSearchParams(window.location.search) }
}

export function href(to: string): string {
  return BASE + to.replace(/^\//, '')
}

export function navigate(to: string, opts: { replace?: boolean } = {}): void {
  const url = href(to)
  if (opts.replace) window.history.replaceState(null, '', url)
  else window.history.pushState(null, '', url)
  window.dispatchEvent(new Event('app:navigate'))
  if (!opts.replace) window.scrollTo(0, 0)
}

export function useRoute(): Route {
  const [route, setRoute] = useState(current)
  useEffect(() => {
    const on = () => setRoute(current())
    window.addEventListener('popstate', on)
    window.addEventListener('app:navigate', on)
    return () => {
      window.removeEventListener('popstate', on)
      window.removeEventListener('app:navigate', on)
    }
  }, [])
  return route
}

export function Link({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={href(to)} onClick={onClick} className={className}>
      {children}
    </a>
  )
}

export const memberPath = (name: string) => `members/${encodeURIComponent(name)}`
export const gamePath = (id: number) => `games/${id}`
export const paifuPath = (id: number, seq: number) => `games/${id}/paifu/${seq}`
