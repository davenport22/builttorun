import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/auth-provider'
import type { Profile, Office } from '@/types'

interface ProfileWithOffice extends Profile {
  offices: Office | null
}

export function useProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*, offices(*)')
        .eq('id', user.id)
        .single()
      if (error) throw error
      return data as unknown as ProfileWithOffice
    },
    enabled: !!user,
  })
}

export function useUpdateProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: { name?: string; office_id?: string; avatar_url?: string }) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('profiles')
        .update(updates as Record<string, unknown>)
        .eq('id', user.id)
        .select()
        .single()
      if (error) throw error
      return data as Profile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
