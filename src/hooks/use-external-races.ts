import { useQuery } from '@tanstack/react-query'
import { fetchExternalRaces, type ExternalRace } from '@/lib/race-scraper'

export type ExternalRaceWithCity = ExternalRace & { city: string }

/**
 * Fetches races for all office cities in parallel and returns them combined.
 * Filtering by city is done client-side so switching chips is instant.
 */
export function useAllOfficeRaces(officeCities: string[]) {
  return useQuery<ExternalRaceWithCity[]>({
    queryKey: ['external-races', 'offices', officeCities.slice().sort().join(',')],
    queryFn: async () => {
      const results = await Promise.all(
        officeCities.map((city) =>
          fetchExternalRaces(1, city).then((races) =>
            races.map((r) => ({ ...r, city }))
          )
        )
      )
      return results.flat()
    },
    staleTime: 1000 * 60 * 30,
    retry: 1,
  })
}
