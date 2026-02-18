import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthGuard } from '@/components/auth/auth-guard'
import { AppShell } from '@/components/layout/app-shell'
import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

const DashboardPage = lazy(() => import('@/pages/dashboard'))
const LeaderboardPage = lazy(() => import('@/pages/leaderboard'))
const UploadPage = lazy(() => import('@/pages/upload'))
const MyRacesPage = lazy(() => import('@/pages/my-races'))
const EventsPage = lazy(() => import('@/pages/events'))
const EventDetailPage = lazy(() => import('@/pages/event-detail'))
const ProfilePage = lazy(() => import('@/pages/profile'))
const LoginPage = lazy(() => import('@/pages/login'))
const RegisterPage = lazy(() => import('@/pages/register'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  )
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

const router = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/',
            element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
          },
          {
            path: '/leaderboard',
            element: <SuspenseWrapper><LeaderboardPage /></SuspenseWrapper>,
          },
          {
            path: '/upload',
            element: <SuspenseWrapper><UploadPage /></SuspenseWrapper>,
          },
          {
            path: '/my-races',
            element: <SuspenseWrapper><MyRacesPage /></SuspenseWrapper>,
          },
          {
            path: '/events',
            element: <SuspenseWrapper><EventsPage /></SuspenseWrapper>,
          },
          {
            path: '/events/:id',
            element: <SuspenseWrapper><EventDetailPage /></SuspenseWrapper>,
          },
          {
            path: '/profile',
            element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
  },
  {
    path: '/register',
    element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
  },
  {
    path: '*',
    element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
  },
])

export function App() {
  return <RouterProvider router={router} />
}
