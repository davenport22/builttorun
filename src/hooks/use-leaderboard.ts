import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Period } from '@/types'
import { startOfWeek, startOfMonth, startOfYear } from 'date-fns'

function getStartDate(period: Period): string | null {
  const now = new Date()
  switch (period) {
    case 'week':
      return startOfWeek(now, { weekStartsOn: 1 }).toISOString().split('T')[0]
    case 'month':
      return startOfMonth(now).toISOString().split('T')[0]
    case 'year':
      return startOfYear(now).toISOString().split('T')[0]
    case 'all':
      return null
  }
}

interface RaceWithJoin {
  user_id: string
  scored_distance_km: number
  profiles: {
    name: string
    avatar_url: string | null
    offices: { name: string; color_theme: string | null } | null
  } | null
}

interface RaceWithOfficeJoin {
  scored_distance_km: number
  profiles: {
    office_id: string | null
    offices: { id: string; name: string; location: string; color_theme: string | null } | null
  } | null
}

export function useIndividualLeaderboard(period: Period) {
  return useQuery({
    queryKey: ['leaderboard', 'individual', period],
    queryFn: async () => {
      const startDate = getStartDate(period)

      let query = supabase
        .from('races')
        .select('user_id, scored_distance_km, profiles(name, avatar_url, offices(name, color_theme))')

      if (startDate) {
        query = query.gte('date', startDate)
      }

      const { data, error } = await query
      if (error) throw error

      const races = data as unknown as RaceWithJoin[]

      const userMap = new Map<string, {
        user_id: string
        name: string
        avatar_url: string | null
        office_name: string | null
        office_color: string | null
        total_scored_distance: number
        total_races: number
      }>()

      for (const race of races) {
        const existing = userMap.get(race.user_id)
        if (existing) {
          existing.total_scored_distance += Number(race.scored_distance_km)
          existing.total_races += 1
        } else {
          userMap.set(race.user_id, {
            user_id: race.user_id,
            name: race.profiles?.name ?? 'Unknown',
            avatar_url: race.profiles?.avatar_url ?? null,
            office_name: race.profiles?.offices?.name ?? null,
            office_color: race.profiles?.offices?.color_theme ?? null,
            total_scored_distance: Number(race.scored_distance_km),
            total_races: 1,
          })
        }
      }

      return Array.from(userMap.values())
        .sort((a, b) => b.total_scored_distance - a.total_scored_distance)
    },
  })
}

export function useOfficeLeaderboard(period: Period) {
  return useQuery({
    queryKey: ['leaderboard', 'office', period],
    queryFn: async () => {
      const startDate = getStartDate(period)

      let query = supabase
        .from('races')
        .select('scored_distance_km, profiles(office_id, offices(id, name, location, color_theme))')

      if (startDate) {
        query = query.gte('date', startDate)
      }

      const { data, error } = await query
      if (error) throw error

      const races = data as unknown as RaceWithOfficeJoin[]

      const officeMap = new Map<string, {
        id: string
        name: string
        location: string
        color_theme: string | null
        total_scored_distance: number
        total_races: number
        member_count: number
      }>()

      const membersPerOffice = new Map<string, Set<string>>()

      for (const race of races) {
        const office = race.profiles?.offices
        if (!office) continue

        const existing = officeMap.get(office.id)
        if (existing) {
          existing.total_scored_distance += Number(race.scored_distance_km)
          existing.total_races += 1
        } else {
          officeMap.set(office.id, {
            id: office.id,
            name: office.name,
            location: office.location,
            color_theme: office.color_theme,
            total_scored_distance: Number(race.scored_distance_km),
            total_races: 1,
            member_count: 0,
          })
        }

        if (!membersPerOffice.has(office.id)) {
          membersPerOffice.set(office.id, new Set())
        }
        if (race.profiles?.office_id) {
          membersPerOffice.get(office.id)!.add(race.profiles.office_id)
        }
      }

      for (const [officeId, members] of membersPerOffice) {
        const office = officeMap.get(officeId)
        if (office) {
          office.member_count = members.size
        }
      }

      return Array.from(officeMap.values())
        .sort((a, b) => b.total_scored_distance - a.total_scored_distance)
    },
  })
}
