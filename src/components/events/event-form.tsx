import { useForm } from 'react-hook-form'
import { useCreateEvent } from '@/hooks/use-events'
import { useOffices } from '@/hooks/use-offices'
import { useProfile } from '@/hooks/use-profile'
import { Loader2 } from 'lucide-react'
import type { Office } from '@/types'

interface EventFormValues {
  name: string
  date: string
  location: string
  distance_km: string
  website_url: string
  office_id: string
}

interface EventFormProps {
  onSuccess?: () => void
}

export function EventForm({ onSuccess }: EventFormProps) {
  const createEvent = useCreateEvent()
  const { data: offices } = useOffices()
  const { data: profile } = useProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    defaultValues: {
      name: '',
      date: '',
      location: '',
      distance_km: '',
      website_url: '',
      office_id: profile?.office_id ?? '',
    },
  })

  const onSubmit = async (data: EventFormValues) => {
    const distanceNum = parseFloat(data.distance_km)
    await createEvent.mutateAsync({
      name: data.name,
      date: data.date,
      location: data.location || null,
      distance_km: !isNaN(distanceNum) && distanceNum > 0 ? distanceNum : null,
      website_url: data.website_url || null,
      office_id: data.office_id || null,
    })
    onSuccess?.()
  }

  const inputClass =
    'w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm outline-none ring-ring transition-colors focus:bg-white focus:ring-2'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="eventName" className="mb-1 block text-sm font-semibold text-foreground">
          Race / Event Name *
        </label>
        <input
          id="eventName"
          type="text"
          className={inputClass}
          placeholder="e.g., Vienna City Marathon"
          {...register('name', { required: 'Event name is required' })}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="eventDate" className="mb-1 block text-sm font-semibold text-foreground">
            Date *
          </label>
          <input
            id="eventDate"
            type="date"
            className={inputClass}
            {...register('date', { required: 'Date is required' })}
          />
          {errors.date && (
            <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="eventDistance" className="mb-1 block text-sm font-semibold text-foreground">
            Distance (km)
          </label>
          <input
            id="eventDistance"
            type="number"
            step="0.1"
            className={inputClass}
            placeholder="10"
            {...register('distance_km')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="eventLocation" className="mb-1 block text-sm font-semibold text-foreground">
            Location
          </label>
          <input
            id="eventLocation"
            type="text"
            className={inputClass}
            placeholder="Vienna, Austria"
            {...register('location')}
          />
        </div>
        <div>
          <label htmlFor="eventOffice" className="mb-1 block text-sm font-semibold text-foreground">
            Nearest Office
          </label>
          <select
            id="eventOffice"
            className={inputClass}
            {...register('office_id')}
          >
            <option value="">All offices</option>
            {(offices as Office[] | undefined)?.map((office) => (
              <option key={office.id} value={office.id}>
                {office.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="eventUrl" className="mb-1 block text-sm font-semibold text-foreground">
          Website URL
        </label>
        <input
          id="eventUrl"
          type="url"
          className={inputClass}
          placeholder="https://example.com"
          {...register('website_url')}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-dark-petrol font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Race'}
      </button>
    </form>
  )
}
