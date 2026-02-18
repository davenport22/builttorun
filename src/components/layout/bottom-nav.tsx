import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Trophy, PlusCircle, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'

const navItems = [
  { to: ROUTES.HOME, icon: LayoutDashboard, label: 'Home' },
  { to: ROUTES.LEADERBOARD, icon: Trophy, label: 'Ranking' },
  { to: ROUTES.UPLOAD, icon: PlusCircle, label: 'Log', isCenter: true },
  { to: ROUTES.EVENTS, icon: Search, label: 'Races' },
  { to: ROUTES.PROFILE, icon: User, label: 'Profile' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl safe-area-pb">
      <div className="mx-auto flex h-16 max-w-screen-lg items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors',
                isActive ? 'text-brand-dark-petrol' : 'text-gray-400',
                item.isCenter && 'relative'
              )
            }
          >
            {({ isActive }) => (
              <>
                {item.isCenter ? (
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg -mt-4',
                    isActive ? 'bg-brand-dark-petrol' : 'bg-brand-teal'
                  )}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <>
                    <item.icon className={cn('h-5 w-5', isActive && 'text-brand-dark-petrol')} />
                    <span className={cn(
                      'text-[10px] font-semibold',
                      isActive && 'text-brand-dark-petrol'
                    )}>
                      {item.label}
                    </span>
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
