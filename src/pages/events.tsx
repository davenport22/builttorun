import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { EventList } from '@/components/events/event-list'
import { EventForm } from '@/components/events/event-form'
import { ExternalRaceCard } from '@/components/events/external-race-card'
import { useProfile } from '@/hooks/use-profile'
import { useOffices } from '@/hooks/use-offices'
import { useCreateEvent } from '@/hooks/use-events'
import { useExternalRaces } from '@/hooks/use-external-races'
import { OFFICES } from '@/constants/offices'
import { PlusCircle, X, Loader2, Globe, Users, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Office } from '@/types'
import type { ExternalRace } from '@/lib/race-scraper'

export default function EventsPage() {
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState<'team' | 'discover'>('discover')
  const [page, setPage] = useState(1)
  const { data: profile } = useProfile()
  const { data: offices } = useOffices()
  const createEvent = useCreateEvent()
  const { data: externalRaces, isLoading: externalLoading, error: externalError } = useExternalRaces(page)

  // Default filter to user's home office
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Set the initial filter to the user's home office once profile loads
  if (profile && !initialized) {
    setSelectedOfficeId(profile.office_id ?? null)
    setInitialized(true)
  }

  const handleAddExternal = async (race: ExternalRace) => {
    // Parse the first distance from the comma-separated list
    const firstDist = race.distances.split(',')[0]?.trim()
    const distNum = parseFloat(firstDist?.replace(',', '.') ?? '')

    // Parse date from "16 Feb 2026" format to "2026-02-16"
    const dateStr = parseGermanDate(race.date)

    await createEvent.mutateAsync({
      name: race.name,
      date: dateStr,
      location: race.location ? `${race.postalCode} ${race.location}`.trim() : null,
      distance_km: !isNaN(distNum) ? distNum : null,
      website_url: race.url,
      office_id: selectedOfficeId,
    })
    setTab('team')
  }

  return (
    <PageContainer>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-brand-dark-petrol">Race Finder</h1>
          <p className="text-xs text-muted-foreground">
            Discover & share upcoming races
          </p>
        </div>
        {tab === 'team' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all',
              showForm
                ? 'bg-gray-100 text-muted-foreground'
                : 'bg-brand-dark-petrol text-white shadow-lg hover:shadow-xl'
            )}
          >
            {showForm ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add'}
          </button>
        )}
      </div>

      {/* Tab selector */}
      <div className="mb-5 flex gap-2">
        <button
          onClick={() => setTab('discover')}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all',
            tab === 'discover'
              ? 'bg-brand-dark-petrol text-white shadow-sm'
              : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
          )}
        >
          <Globe className="h-3.5 w-3.5" />
          Discover
        </button>
        <button
          onClick={() => setTab('team')}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all',
            tab === 'team'
              ? 'bg-brand-dark-petrol text-white shadow-sm'
              : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
          )}
        >
          <Users className="h-3.5 w-3.5" />
          Team Races
        </button>
      </div>

      {/* Team Races tab */}
      {tab === 'team' && (
        <>
          {/* Office filter chips */}
          <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedOfficeId(null)}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all',
                selectedOfficeId === null
                  ? 'bg-brand-dark-petrol text-white shadow-sm'
                  : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
              )}
            >
              All
            </button>
            {(offices as Office[] | undefined)?.map((office) => {
              const officeConst = OFFICES.find((o) => o.name === office.name)
              return (
                <button
                  key={office.id}
                  onClick={() =>
                    setSelectedOfficeId(selectedOfficeId === office.id ? null : office.id)
                  }
                  className={cn(
                    'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all',
                    selectedOfficeId === office.id
                      ? 'text-white shadow-sm'
                      : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                  )}
                  style={
                    selectedOfficeId === office.id
                      ? { backgroundColor: officeConst?.colorTheme ?? '#00677F' }
                      : undefined
                  }
                >
                  {office.name}
                </button>
              )
            })}
          </div>

          {showForm && (
            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
              <EventForm onSuccess={() => setShowForm(false)} />
            </div>
          )}

          <EventList officeId={selectedOfficeId} />
        </>
      )}

      {/* Discover tab - external race listings */}
      {tab === 'discover' && (
        <>
          <div className="mb-4 rounded-2xl bg-brand-dark-petrol/5 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Upcoming races from <span className="font-bold text-brand-dark-petrol">Runners World Laufkalender</span>. Tap <span className="font-bold text-brand-dark-petrol">+</span> to add a race to your team.
            </p>
          </div>

          {externalLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
            </div>
          )}

          {externalError && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
              <div>
                <p className="text-sm font-bold text-foreground">Could not load races</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  The external race calendar is temporarily unavailable.
                </p>
              </div>
              <a
                href="https://www.runnersworld.de/laufkalender/?speakingUrl=laufevents&q="
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-xl bg-brand-dark-petrol px-4 py-2 text-sm font-bold text-white shadow-sm"
              >
                Open on Runners World
              </a>
            </div>
          )}

          {externalRaces && externalRaces.length > 0 && (
            <>
              <div className="flex flex-col gap-2.5">
                {externalRaces.map((race, i) => (
                  <ExternalRaceCard
                    key={`${race.url}-${i}`}
                    race={race}
                    onAdd={handleAddExternal}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-dark-petrol shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-bold text-brand-dark-petrol">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-dark-petrol shadow-sm transition-colors hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Source: runnersworld.de/laufkalender
              </p>
            </>
          )}

          {externalRaces && externalRaces.length === 0 && !externalLoading && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No more races found on this page.
            </div>
          )}
        </>
      )}
    </PageContainer>
  )
}

/**
 * Parse a German date string like "16 Feb 2026" or "16 Feb. 2026" to "2026-02-16"
 */
function parseGermanDate(dateStr: string): string {
  const months: Record<string, string> = {
    'jan': '01', 'feb': '02', 'mär': '03', 'mar': '03', 'apr': '04',
    'mai': '05', 'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
    'sep': '09', 'okt': '10', 'oct': '10', 'nov': '11', 'dez': '12', 'dec': '12',
  }
  const cleaned = dateStr.replace('.', '').trim()
  const parts = cleaned.split(/\s+/)
  if (parts.length < 3) return new Date().toISOString().split('T')[0]

  const day = parts[0].padStart(2, '0')
  const monthKey = parts[1].toLowerCase().slice(0, 3)
  const month = months[monthKey] ?? '01'
  const year = parts[2]

  return `${year}-${month}-${day}`
}
