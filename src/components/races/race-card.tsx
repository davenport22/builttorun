import { formatTime, formatDistance, formatPace, formatDateShort } from '@/lib/formatting'
import { Mountain, Trash2 } from 'lucide-react'
import type { Race } from '@/types'

interface RaceCardProps {
  race: Race
  onDelete?: (race: Race) => void
}

export function RaceCard({ race, onDelete }: RaceCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-brand-dark-petrol">{race.race_name}</h3>
            {race.elevation_boost && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-mint/20 px-2 py-0.5 text-xs font-bold text-brand-teal">
                <Mountain className="h-3 w-3" />
                +10%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{formatDateShort(race.date)}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(race)}
            className="rounded-xl p-2 text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete race"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Distance</p>
          <p className="text-lg font-extrabold text-brand-dark-petrol">
            {formatDistance(Number(race.scored_distance_km))}
            <span className="text-xs font-bold"> km</span>
          </p>
          {race.elevation_boost && (
            <p className="text-xs font-medium text-brand-teal">
              ({formatDistance(Number(race.distance_km))} actual)
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Time</p>
          <p className="text-lg font-extrabold text-brand-dark-petrol">
            {formatTime(race.time_seconds)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pace</p>
          <p className="text-lg font-extrabold text-brand-dark-petrol">
            {formatPace(Number(race.distance_km), race.time_seconds)}
          </p>
        </div>
      </div>
    </div>
  )
}
