import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/page-container'
import { useEvent, useToggleParticipation } from '@/hooks/use-events'
import { useAuth } from '@/providers/auth-provider'
import { formatDateShort, formatDistance } from '@/lib/formatting'
import { Calendar, MapPin, ExternalLink, Users, ArrowLeft, Loader2, Share2 } from 'lucide-react'
import { getEventImage } from '@/constants/images'

function buildWhatsAppUrl(event: { name: string; date: string; location: string | null; distance_km: number | null; website_url: string | null }) {
  const parts = [`*${event.name}*`]
  parts.push(`Date: ${formatDateShort(event.date)}`)
  if (event.location) parts.push(`Location: ${event.location}`)
  if (event.distance_km) parts.push(`Distance: ${formatDistance(event.distance_km)} km`)
  if (event.website_url) parts.push(event.website_url)
  parts.push('\nJoin me on Built to Run!')
  return `https://wa.me/?text=${encodeURIComponent(parts.join('\n'))}`
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: event, isLoading } = useEvent(id!)
  const toggleParticipation = useToggleParticipation()

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
        </div>
      </PageContainer>
    )
  }

  if (!event) {
    return (
      <PageContainer>
        <p className="text-center text-muted-foreground">Event not found.</p>
      </PageContainer>
    )
  }

  const userParticipation = event.participations?.find(
    (p) => p.user_id === user?.id
  )

  const goingCount = event.participations?.filter((p) => p.status === 'going').length ?? 0
  const interestedCount = event.participations?.filter((p) => p.status === 'interested').length ?? 0

  return (
    <PageContainer>
      <Link
        to="/events"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Hero image */}
      <div className="relative -mx-4 mb-6 overflow-hidden rounded-2xl">
        <img
          src={getEventImage(0)}
          alt=""
          className="h-44 w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-petrol/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
          <h1 className="text-xl font-extrabold text-white">{event.name}</h1>
          <a
            href={buildWhatsAppUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
            title="Share via WhatsApp"
          >
            <Share2 className="h-4 w-4 text-brand-dark-petrol" />
          </a>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-brand-teal" />
            {formatDateShort(event.date)}
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-brand-teal" />
              {event.location}
            </div>
          )}
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
          {event.website_url && (
            <a
              href={event.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-brand-dark-petrol hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Event Website
            </a>
          )}
        </div>

        <div className="mb-5 flex gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="h-4 w-4 text-brand-mint" />
            <span className="font-bold">{goingCount}</span> going
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="font-bold">{interestedCount}</span> interested
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => toggleParticipation.mutate({ eventId: event.id, status: 'going' })}
            disabled={toggleParticipation.isPending}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              userParticipation?.status === 'going'
                ? 'bg-brand-mint text-brand-dark-petrol shadow-sm'
                : 'border-2 border-brand-dark-petrol/20 text-brand-dark-petrol hover:bg-brand-dark-petrol/5'
            }`}
          >
            {userParticipation?.status === 'going' ? "I'm Going!" : "I'll Run"}
          </button>
          <button
            onClick={() => toggleParticipation.mutate({ eventId: event.id, status: 'interested' })}
            disabled={toggleParticipation.isPending}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              userParticipation?.status === 'interested'
                ? 'bg-brand-mint/40 text-brand-dark-petrol shadow-sm'
                : 'border-2 border-border text-muted-foreground hover:bg-gray-50'
            }`}
          >
            Shortlisted
          </button>
        </div>

        {event.participations && event.participations.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-bold text-brand-dark-petrol">Participants</h3>
            <div className="flex flex-col gap-2">
              {event.participations.map((p) => (
                <div
                  key={p.user_id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark-petrol text-xs font-bold text-white">
                      {p.profiles?.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <span className="font-medium">{p.profiles?.name ?? 'Unknown'}</span>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    p.status === 'going'
                      ? 'bg-brand-mint/20 text-brand-dark-petrol'
                      : 'bg-gray-200 text-muted-foreground'
                  }`}>
                    {p.status === 'interested' ? 'shortlisted' : p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
