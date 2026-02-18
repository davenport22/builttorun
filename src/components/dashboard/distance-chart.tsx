import { useMyRaces } from '@/hooks/use-races'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, eachWeekOfInterval, subWeeks } from 'date-fns'
import type { Race } from '@/types'

export function DistanceChart() {
  const { data: races, isLoading } = useMyRaces()

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
  }

  if (!races || races.length === 0) {
    return null
  }

  const typedRaces = races as Race[]

  // Aggregate by week (last 12 weeks)
  const now = new Date()
  const weeksAgo12 = subWeeks(now, 12)
  const weeks = eachWeekOfInterval(
    { start: weeksAgo12, end: now },
    { weekStartsOn: 1 }
  )

  const chartData = weeks.map((weekStart) => {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const weekRaces = typedRaces.filter((r) => {
      const d = new Date(r.date)
      return d >= weekStart && d < weekEnd
    })

    const totalDistance = weekRaces.reduce(
      (sum, r) => sum + Number(r.scored_distance_km),
      0
    )

    return {
      week: format(weekStart, 'dd MMM'),
      distance: Number(totalDistance.toFixed(1)),
    }
  })

  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-foreground">Weekly Distance</h2>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="distanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#073C4E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#54DBC0" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="week"
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
              formatter={(value) => [`${value} km`, 'Distance']}
            />
            <Area
              type="monotone"
              dataKey="distance"
              stroke="#073C4E"
              strokeWidth={2.5}
              fill="url(#distanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
