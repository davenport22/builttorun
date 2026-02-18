import { PageContainer } from '@/components/layout/page-container'
import { RaceList } from '@/components/races/race-list'
import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { ROUTES } from '@/constants/routes'

export default function MyRacesPage() {
  return (
    <PageContainer>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-brand-dark-petrol">My Races</h1>
          <p className="text-xs text-muted-foreground">Your running history</p>
        </div>
        <Link
          to={ROUTES.UPLOAD}
          className="flex items-center gap-1.5 rounded-xl bg-brand-dark-petrol px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl"
        >
          <PlusCircle className="h-4 w-4" />
          Add
        </Link>
      </div>
      <RaceList />
    </PageContainer>
  )
}
