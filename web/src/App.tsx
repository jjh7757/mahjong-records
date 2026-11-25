import { AdminPage } from './pages/AdminPage'
import { GamePage } from './pages/GamePage'
import { GamesPage } from './pages/GamesPage'
import { Leaderboard } from './pages/Leaderboard'
import { MemberPage } from './pages/MemberPage'
import { PaifuPage } from './pages/PaifuPage'
import { Link, useRoute, type Route } from './router'

function Page({ route }: { route: Route }) {
  const [a, b, c, d] = route.segments
  if (!a) return <Leaderboard route={route} />
  if (a === 'members' && b) return <MemberPage name={b} />
  if (a === 'games' && !b) return <GamesPage route={route} />
  if (a === 'games' && /^\d+$/.test(b ?? '') && !c) return <GamePage id={Number(b)} />
  if (a === 'games' && /^\d+$/.test(b ?? '') && c === 'paifu' && /^\d+$/.test(d ?? '')) return <PaifuPage gameId={Number(b)} seq={Number(d)} />
  if (a === 'admin') return <AdminPage />
  return (
    <section className="card">
      <h1>없는 화면입니다</h1>
      <p>
        <Link to="">순위표로</Link>
      </p>
    </section>
  )
}

export function App() {
  const route = useRoute()
  const top = route.segments[0] ?? ''
  const tab = (key: string, to: string, label: string) => (
    <Link to={to} className={`tab ${top === key ? 'on' : ''}`}>
      {label}
    </Link>
  )
  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link to="" className="brand">
            <span className="brand-tile" aria-hidden>
              中
            </span>
            대국 기록
          </Link>
          <nav className="tabs">
            {tab('', '', '순위')}
            {tab('games', 'games', '대국')}
          </nav>
        </div>
      </header>
      <main className="container">
        <Page route={route} />
      </main>
      <footer className="footer">
        <span>태블릿 점수 계산기에서 올린 대국</span>
        <Link to="admin" className="muted">
          관리
        </Link>
      </footer>
    </>
  )
}
