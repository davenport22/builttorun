import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import { OfficeRanking } from '@/components/leaderboard/office-ranking'
import { PeriodSelector } from '@/components/leaderboard/period-selector'
import { Trophy, Building2 } from 'lucide-react'
import type { Period } from '@/types'

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('month')
  const [view, setView] = useState<'individual' | 'office'>('individual')

  return (
    <PageContainer>
      <h1 className="mb-1 text-xl font-extrabold text-brand-dark-petrol">Leaderboard</h1>
      <p className="mb-5 text-xs text-muted-foreground">See who's crushing it</p>

      <PeriodSelector value={period} onChange={setPeriod} />

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setView('individual')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
            view === 'individual'
              ? 'bg-brand-dark-petrol text-white shadow-sm'
              : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
          }`}
        >
          <Trophy className="h-3.5 w-3.5" />
          Individual
        </button>
        <button
          onClick={() => setView('office')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
            view === 'office'
              ? 'bg-brand-dark-petrol text-white shadow-sm'
              : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          Office
        </button>
      </div>

      <div className="mt-4">
        {view === 'individual' ? (
          <LeaderboardTable period={period} />
        ) : (
          <OfficeRanking period={period} />
        )}
      </div>
    </PageContainer>
  )
}
