import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/auth-provider'
import type { Race, RaceInsert } from '@/types'

interface RaceWithProfile extends Race {
  profiles: {
    name: string
    avatar_url: string | null
    offices: { name: string; color_theme: string | null } | null
  } | null
}

export function useMyRaces() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['races', 'mine', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('races')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      if (error) throw error
      return data as Race[]
    },
    enabled: !!user,
  })
}

export function useRecentRaces(limit = 20) {
  return useQuery({
    queryKey: ['races', 'recent', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('races')
        .select('*, profiles(name, avatar_url, offices(name, color_theme))')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data as RaceWithProfile[]
    },
  })
}

export function useMyStats() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['races', 'stats', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('races')
        .select('distance_km, scored_distance_km, time_seconds, elevation_boost, date')
        .eq('user_id', user.id)
      if (error) throw error

      const rows = data as { distance_km: number; scored_distance_km: number; time_seconds: number; elevation_boost: boolean; date: string }[]
      const now = new Date()
      const thisMonth = rows.filter((r) => {
        const d = new Date(r.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })

      const totalScoredDistance = rows.reduce((sum, r) => sum + Number(r.scored_distance_km), 0)
      const totalTimeSeconds = rows.reduce((sum, r) => sum + r.time_seconds, 0)
      const totalRawDistance = rows.reduce((sum, r) => sum + Number(r.distance_km), 0)
      const monthDistance = thisMonth.reduce((sum, r) => sum + Number(r.scored_distance_km), 0)
      const boostRaces = rows.filter((r) => r.elevation_boost).length
      const elevationBonus = totalScoredDistance - totalRawDistance

      return {
        totalScoredDistance: Number(totalScoredDistance.toFixed(2)),
        totalRaces: rows.length,
        monthDistance: Number(monthDistance.toFixed(2)),
        averagePace: totalRawDistance > 0 ? totalTimeSeconds / totalRawDistance : 0,
        boostRaces,
        elevationBonus: Number(elevationBonus.toFixed(2)),
      }
    },
    enabled: !!user,
  })
}

export function useCreateRace() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      race,
      screenshot,
    }: {
      race: Omit<RaceInsert, 'user_id'>
      screenshot?: File
    }) => {
      if (!user) throw new Error('Not authenticated')

      let screenshotUrl: string | undefined

      if (screenshot) {
        const ext = screenshot.name.split('.').pop() || 'jpg'
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('race-screenshots')
          .upload(path, screenshot, { contentType: screenshot.type })
        if (uploadError) throw uploadError
        screenshotUrl = path
      }

      const { data, error } = await supabase
        .from('races')
        .insert({
          ...race,
          user_id: user.id,
          screenshot_url: screenshotUrl ?? null,
        })
        .select()
        .single()
      if (error) throw error
      return data as Race
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['races'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    },
  })
}

export function useDeleteRace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (race: { id: string; screenshot_url: string | null }) => {
      if (race.screenshot_url) {
        await supabase.storage.from('race-screenshots').remove([race.screenshot_url])
      }
      const { error } = await supabase.from('races').delete().eq('id', race.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['races'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    },
  })
}
