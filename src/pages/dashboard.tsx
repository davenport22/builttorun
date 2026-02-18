import { PageContainer } from '@/components/layout/page-container'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { DistanceChart } from '@/components/dashboard/distance-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { useProfile } from '@/hooks/use-profile'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { DASHBOARD_HERO } from '@/constants/images'

export default function DashboardPage() {
  const { data: profile } = useProfile()

  return (
    <PageContainer>
      {/* Hero card with B&W image */}
      <div className="relative mb-6 overflow-hidden rounded-3xl">
        <img
          src={DASHBOARD_HERO}
          alt=""
          className="h-52 w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-petrol via-brand-dark-petrol/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-sm font-medium text-brand-mint">
            {profile?.offices
              ? (profile.offices as { name: string }).name + ' Office'
              : 'Welcome back'}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            {profile?.name ? `Hey, ${profile.name}` : 'Hey there'}
          </h1>
          <Link
            to={ROUTES.UPLOAD}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-mint px-5 py-2 text-sm font-bold text-brand-dark-petrol shadow-lg transition-transform hover:scale-105"
          >
            Log a Race
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <StatsCards />

      <div className="mt-6">
        <DistanceChart />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-base font-bold text-foreground">Recent Activity</h2>
        <ActivityFeed />
      </div>
    </PageContainer>
  )
}
