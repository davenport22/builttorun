import { useMyRaces, useDeleteRace } from '@/hooks/use-races'
import { RaceCard } from './race-card'
import { Loader2, Trophy } from 'lucide-react'
import type { Race } from '@/types'
import { useState } from 'react'

export function RaceList() {
  const { data: races, isLoading } = useMyRaces()
  const deleteRace = useDeleteRace()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (race: Race) => {
    if (!confirm('Delete this race? This cannot be undone.')) return
    setDeletingId(race.id)
    try {
      await deleteRace.mutateAsync({ id: race.id, screenshot_url: race.screenshot_url })
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
      </div>
    )
  }

  if (!races || races.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Trophy className="h-12 w-12 text-gray-200" />
        <div>
          <p className="font-bold text-foreground">No races yet</p>
          <p className="text-sm text-muted-foreground">
            Upload your first race result to get started!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {races.map((race) => (
        <div key={race.id} className={deletingId === race.id ? 'opacity-50' : ''}>
          <RaceCard race={race} onDelete={handleDelete} />
        </div>
      ))}
    </div>
  )
}
