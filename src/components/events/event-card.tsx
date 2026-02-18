import { Link } from 'react-router-dom'
import { formatDateShort, formatDistance } from '@/lib/formatting'
import { Calendar, MapPin, Users, Share2 } from 'lucide-react'
import { getEventImage } from '@/constants/images'

interface EventCardProps {
  event: {
    id: string
    name: string
    date: string
    location: string | null
    distance_km: number | null
    website_url: string | null
    offices?: { name: string; color_theme: string | null } | null
    participations?: Array<{
      user_id: string
      status: string
      profiles: { name: string; avatar_url: string | null } | null
    }>
  }
  index?: number
}

function buildWhatsAppUrl(event: EventCardProps['event']) {
  const parts = [`*${event.name}*`]
  parts.push(`Date: ${formatDateShort(event.date)}`)
  if (event.location) parts.push(`Location: ${event.location}`)
  if (event.distance_km) parts.push(`Distance: ${formatDistance(event.distance_km)} km`)
  if (event.website_url) parts.push(event.website_url)
  parts.push('\nFound on Built to Run')
  return `https://wa.me/?text=${encodeURIComponent(parts.join('\n'))}`
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const goingCount = event.participations?.filter((p) => p.status === 'going').length ?? 0
  const interestedCount = event.participations?.filter((p) => p.status === 'interested').length ?? 0
  const totalParticipants = goingCount + interestedCount

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Image header */}
      <Link to={`/events/${event.id}`} className="relative block h-32 w-full overflow-hidden">
        <img
          src={getEventImage(index)}
          alt=""
          className="h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-petrol/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="text-sm font-bold text-white">{event.name}</h3>
        </div>

        {/* Share button */}
        <a
          href={buildWhatsAppUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-dark-petrol shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
          title="Share via WhatsApp"
        >
          <Share2 className="h-3.5 w-3.5" />
        </a>
      </Link>

      {/* Card body */}
      <Link to={`/events/${event.id}`} className="block p-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 text-brand-teal" />
            {formatDateShort(event.date)}
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-brand-teal" />
              {event.location}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {event.distance_km && (
              <span className="rounded-full bg-brand-dark-petrol/10 px-2.5 py-0.5 text-xs font-bold text-brand-dark-petrol">
                {formatDistance(event.distance_km)} km
              </span>
            )}
            {event.offices && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: event.offices.color_theme ?? '#00677F' }}
              >
                {event.offices.name}
              </span>
            )}
          </div>
          {totalParticipants > 0 && (
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Users className="h-3 w-3" />
              {totalParticipants}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
