import type { Period } from '@/types'

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
}

const periods: { value: Period; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'all', label: 'All Time' },
]

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex rounded-2xl bg-gray-100 p-1">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
            value === period.value
              ? 'bg-brand-dark-petrol text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
