import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { BottomNav } from './bottom-nav'

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
