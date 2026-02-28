import { useQuery } from '@tanstack/react-query'
import { fetchExternalRaces, type ExternalRace } from '@/lib/race-scraper'

export function useExternalRaces(page = 1, city = '') {
  return useQuery<ExternalRace[]>({
    queryKey: ['external-races', page, city],
    queryFn: () => fetchExternalRaces(page, city),
    staleTime: 1000 * 60 * 30, // cache for 30 min
    retry: 1,
  })
}
