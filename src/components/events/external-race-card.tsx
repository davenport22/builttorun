import { Calendar, MapPin, ExternalLink, PlusCircle } from 'lucide-react'
import type { ExternalRace } from '@/lib/race-scraper'

interface ExternalRaceCardProps {
  race: ExternalRace
  onAdd?: (race: ExternalRace) => void
}

export function ExternalRaceCard({ race, onAdd }: ExternalRaceCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-brand-dark-petrol">{race.name}</h3>
          <div className="mt-1.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 text-brand-teal" />
              {race.date}
            </div>
            {race.location && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-brand-teal" />
                {race.postalCode ? `${race.postalCode} ${race.location}` : race.location}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 gap-1.5">
          {onAdd && (
            <button
              onClick={() => onAdd(race)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark-petrol/10 text-brand-dark-petrol transition-colors hover:bg-brand-dark-petrol hover:text-white"
              title="Add to team races"
            >
              <PlusCircle className="h-3.5 w-3.5" />
            </button>
          )}
          <a
            href={race.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-muted-foreground transition-colors hover:bg-gray-200"
            title="View on Runners World"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Distance pills */}
      {race.distances && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {race.distances.split(',').map((d, i) => (
            <span
              key={i}
              className="rounded-full bg-brand-dark-petrol/8 px-2 py-0.5 text-xs font-bold text-brand-dark-petrol"
            >
              {d.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
