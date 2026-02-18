import { useIndividualLeaderboard } from '@/hooks/use-leaderboard'
import { useAuth } from '@/providers/auth-provider'
import { formatDistance } from '@/lib/formatting'
import { Loader2, Trophy, Medal } from 'lucide-react'
import type { Period } from '@/types'

interface LeaderboardTableProps {
  period: Period
}

export function LeaderboardTable({ period }: LeaderboardTableProps) {
  const { data: entries, isLoading } = useIndividualLeaderboard(period)
  const { user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Trophy className="h-12 w-12 text-gray-200" />
        <p className="text-sm text-muted-foreground">No races logged for this period yet.</p>
      </div>
    )
  }

  const getRankIcon = (rank: number) => {
    if (rank === 0) return { color: 'text-amber-500', bg: 'bg-amber-50' }
    if (rank === 1) return { color: 'text-gray-400', bg: 'bg-gray-50' }
    if (rank === 2) return { color: 'text-amber-700', bg: 'bg-amber-50/50' }
    return { color: 'text-muted-foreground', bg: '' }
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry, index) => {
        const isCurrentUser = entry.user_id === user?.id
        const rankStyle = getRankIcon(index)

        return (
          <div
            key={entry.user_id}
            className={`flex items-center gap-3 rounded-2xl p-3.5 transition-colors ${
              isCurrentUser
                ? 'bg-brand-mint/10 ring-1 ring-brand-mint/30'
                : 'bg-white shadow-sm'
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${rankStyle.bg}`}>
              {index < 3 ? (
                <Medal className={`h-5 w-5 ${rankStyle.color}`} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">
                  {index + 1}
                </span>
              )}
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark-petrol text-xs font-bold text-white">
              {entry.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">
                {entry.name}
                {isCurrentUser && (
                  <span className="ml-1 text-xs font-medium text-brand-teal">(you)</span>
                )}
              </p>
              {entry.office_name && (
                <p className="text-xs text-muted-foreground">{entry.office_name}</p>
              )}
            </div>

            <div className="text-right">
              <p className="text-sm font-extrabold text-brand-dark-petrol">
                {formatDistance(entry.total_scored_distance)} km
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.total_races} race{entry.total_races !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
