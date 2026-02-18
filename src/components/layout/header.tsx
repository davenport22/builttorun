import { useAuth } from '@/providers/auth-provider'
import { Link } from 'react-router-dom'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-screen-lg items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-dark-petrol">
            <span className="text-sm font-black tracking-tight text-white">BR</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-extrabold uppercase tracking-wide text-brand-dark-petrol">
              Built to Run
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-teal">
              Build to Evolve
            </span>
          </div>
        </Link>

        <Link
          to="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark-petrol shadow-md"
        >
          <span className="text-xs font-bold text-white">
            {user?.email?.charAt(0).toUpperCase() ?? '?'}
          </span>
        </Link>
      </div>
    </header>
  )
}
