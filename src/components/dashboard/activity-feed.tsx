import { useRecentRaces } from '@/hooks/use-races'
import { formatDistance, formatTime, formatDateRelative } from '@/lib/formatting'
import { Mountain, Loader2, Activity } from 'lucide-react'

export function ActivityFeed() {
  const { data: races, isLoading } = useRecentRaces(20)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
      </div>
    )
  }

  if (!races || races.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <Activity className="h-8 w-8 text-gray-300" />
        <p className="text-sm text-muted-foreground">No activity yet. Be the first to log a race!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {races.map((race) => {
        const profile = race.profiles as {
          name: string
          avatar_url: string | null
          offices: { name: string; color_theme: string | null } | null
        } | null

        return (
          <div
            key={race.id}
            className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-dark-petrol text-xs font-bold text-white">
              {profile?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 text-sm">
              <p>
                <span className="font-bold text-foreground">{profile?.name ?? 'Unknown'}</span>
                {profile?.offices && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    {profile.offices.name}
                  </span>
                )}
                {' '}ran{' '}
                <span className="font-bold text-brand-dark-petrol">
                  {formatDistance(Number(race.scored_distance_km))} km
                </span>
                {race.race_name && (
                  <>
                    {' '}at <span className="font-semibold">{race.race_name}</span>
                  </>
                )}
                {race.elevation_boost && (
                  <Mountain className="ml-1 inline h-3 w-3 text-brand-teal" />
                )}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatTime(race.time_seconds)}</span>
                <span>·</span>
                <span>{formatDateRelative(race.created_at)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
