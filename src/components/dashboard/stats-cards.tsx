import { useMyStats } from '@/hooks/use-races'
import { Activity, Trophy, Calendar, Timer, Mountain } from 'lucide-react'
import { formatPace } from '@/lib/formatting'

export function StatsCards() {
  const { data: stats, isLoading } = useMyStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: 'Total Distance',
      value: `${stats?.totalScoredDistance?.toFixed(1) ?? '0'}`,
      unit: 'km',
      icon: Activity,
      bg: 'bg-brand-dark-petrol',
      text: 'text-white',
      accent: 'text-brand-mint',
    },
    {
      label: 'Total Races',
      value: String(stats?.totalRaces ?? 0),
      unit: '',
      icon: Trophy,
      bg: 'bg-brand-teal',
      text: 'text-white',
      accent: 'text-white/70',
    },
    {
      label: 'This Month',
      value: `${stats?.monthDistance?.toFixed(1) ?? '0'}`,
      unit: 'km',
      icon: Calendar,
      bg: 'bg-white',
      text: 'text-brand-dark-petrol',
      accent: 'text-muted-foreground',
    },
    {
      label: 'Avg Pace',
      value: stats?.averagePace ? formatPace(1, stats.averagePace).replace(' /km', '') : '-',
      unit: '/km',
      icon: Timer,
      bg: 'bg-white',
      text: 'text-brand-dark-petrol',
      accent: 'text-muted-foreground',
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl p-4 shadow-sm ${card.bg}`}
          >
            <div className="flex items-center gap-1.5">
              <card.icon className={`h-3.5 w-3.5 ${card.accent}`} />
              <span className={`text-xs font-medium ${card.accent}`}>{card.label}</span>
            </div>
            <p className={`mt-2 text-2xl font-extrabold tracking-tight ${card.text}`}>
              {card.value}
              {card.unit && <span className="ml-0.5 text-sm font-semibold">{card.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {stats && stats.elevationBonus > 0 && (
        <div className="flex items-center gap-2 rounded-2xl bg-brand-mint/10 px-4 py-3">
          <Mountain className="h-4 w-4 text-brand-teal" />
          <span className="text-sm text-foreground">
            <span className="font-bold">+{stats.elevationBonus.toFixed(1)} km</span>
            {' '}from elevation boost ({stats.boostRaces} races)
          </span>
        </div>
      )}
    </div>
  )
}
