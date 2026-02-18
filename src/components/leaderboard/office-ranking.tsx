import { useOfficeLeaderboard } from '@/hooks/use-leaderboard'
import { formatDistance } from '@/lib/formatting'
import { Loader2, Building2, Crown } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { Period } from '@/types'

interface OfficeRankingProps {
  period: Period
}

const barColors = ['#073C4E', '#00677F', '#249C97', '#54DBC0', '#693355']

export function OfficeRanking({ period }: OfficeRankingProps) {
  const { data: offices, isLoading } = useOfficeLeaderboard(period)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
      </div>
    )
  }

  if (!offices || offices.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Building2 className="h-12 w-12 text-gray-200" />
        <p className="text-sm text-muted-foreground">No office data for this period yet.</p>
      </div>
    )
  }

  const chartData = offices.map((o) => ({
    name: o.name,
    distance: Number(o.total_scored_distance.toFixed(1)),
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              unit=" km"
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value} km`, 'Total Distance']}
            />
            <Bar dataKey="distance" radius={[8, 8, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2">
        {offices.map((office, index) => (
          <div
            key={office.id}
            className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: barColors[index % barColors.length] + '15' }}
            >
              {index === 0 ? (
                <Crown className="h-4 w-4" style={{ color: barColors[0] }} />
              ) : (
                <span className="text-sm font-extrabold" style={{ color: barColors[index % barColors.length] }}>
                  {index + 1}
                </span>
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{office.name}</p>
              <p className="text-xs text-muted-foreground">{office.location}</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-extrabold text-brand-dark-petrol">
                {formatDistance(office.total_scored_distance)} km
              </p>
              <p className="text-xs text-muted-foreground">
                {office.total_races} race{office.total_races !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
