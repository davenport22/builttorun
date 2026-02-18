import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/auth-provider'
import type { Event, EventInsert } from '@/types'

interface EventWithParticipants extends Event {
  participations: Array<{
    user_id: string
    status: string
    profiles: { name: string; avatar_url: string | null } | null
  }>
  offices: { id: string; name: string; color_theme: string | null } | null
}

export function useUpcomingEvents(officeId?: string | null) {
  return useQuery({
    queryKey: ['events', 'upcoming', officeId ?? 'all'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]
      let query = supabase
        .from('events')
        .select('*, participations(user_id, status, profiles(name, avatar_url)), offices(id, name, color_theme)')
        .gte('date', today)
        .order('date', { ascending: true })

      if (officeId) {
        query = query.eq('office_id', officeId)
      }

      const { data, error } = await query
      if (error) throw error
      return data as unknown as EventWithParticipants[]
    },
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, participations(user_id, status, profiles(name, avatar_url)), offices(id, name, color_theme)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as unknown as EventWithParticipants
    },
    enabled: !!id,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (event: Omit<EventInsert, 'created_by'>) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('events')
        .insert({ ...event, created_by: user.id } as EventInsert)
        .select()
        .single()
      if (error) throw error
      return data as Event
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useToggleParticipation() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      if (!user) throw new Error('Not authenticated')

      const { data: existing } = await supabase
        .from('participations')
        .select('status')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existing?.status === status) {
        const { error } = await supabase
          .from('participations')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id)
        if (error) throw error
        return null
      }

      const { data, error } = await supabase
        .from('participations')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
        } as { event_id: string; user_id: string; status: string })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
