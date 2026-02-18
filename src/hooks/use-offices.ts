import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useOffices() {
  return useQuery({
    queryKey: ['offices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offices')
        .select('*')
        .order('name')
      if (error) throw error
      return data
    },
  })
}
