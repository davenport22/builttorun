import { useUpcomingEvents } from '@/hooks/use-events'
import { EventCard } from './event-card'
import { Loader2, Calendar } from 'lucide-react'

interface EventListProps {
  officeId?: string | null
}

export function EventList({ officeId }: EventListProps) {
  const { data: events, isLoading } = useUpcomingEvents(officeId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Calendar className="h-12 w-12 text-gray-200" />
        <div>
          <p className="font-bold text-foreground">No upcoming races</p>
          <p className="text-sm text-muted-foreground">
            Add a race to get the team running together!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  )
}
