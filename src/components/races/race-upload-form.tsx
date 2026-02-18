import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOcr } from '@/hooks/use-ocr'
import { useCreateRace } from '@/hooks/use-races'
import { calculateScoredDistance } from '@/lib/scoring'
import { parseTimeToSeconds } from '@/lib/formatting'
import { Upload, Loader2, Mountain, Check, AlertCircle, ArrowRight, Flame } from 'lucide-react'
import { getRandomCompliment } from '@/constants/compliments'
import { UPLOAD_HERO } from '@/constants/images'

export function RaceUploadForm() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { status: ocrStatus, result: ocrResult, processImage, reset: resetOcr } = useOcr()
  const createRace = useCreateRace()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [step, setStep] = useState<'upload' | 'processing' | 'confirm' | 'success'>('upload')

  // Form state
  const [raceName, setRaceName] = useState('')
  const [distance, setDistance] = useState('')
  const [time, setTime] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [elevationBoost, setElevationBoost] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Pick a compliment once when success step is reached
  const [compliment] = useState(() => getRandomCompliment())

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setStep('processing')
    await processImage(selectedFile)
    setStep('confirm')
  }, [processImage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files?.[0] && files[0].type.startsWith('image/')) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  // Fill form with OCR results when available
  if (ocrStatus === 'done' && ocrResult && step === 'confirm') {
    if (!raceName && ocrResult.parsedRaceName) setRaceName(ocrResult.parsedRaceName)
    if (!distance && ocrResult.parsedDistance) setDistance(String(ocrResult.parsedDistance))
    if (!time && ocrResult.parsedTime) setTime(ocrResult.parsedTime)
  }

  const distanceNum = parseFloat(distance) || 0
  const scoredDistance = calculateScoredDistance(distanceNum, elevationBoost)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const timeSeconds = parseTimeToSeconds(time)
    if (!timeSeconds || timeSeconds <= 0) {
      setSubmitError('Please enter a valid time (e.g., 1:23:45 or 45:30)')
      return
    }
    if (distanceNum <= 0) {
      setSubmitError('Please enter a valid distance')
      return
    }

    try {
      await createRace.mutateAsync({
        race: {
          race_name: raceName || 'Unnamed Race',
          distance_km: distanceNum,
          time_seconds: timeSeconds,
          date,
          elevation_boost: elevationBoost,
        },
        screenshot: file ?? undefined,
      })
      setStep('success')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save race')
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setStep('upload')
    setRaceName('')
    setDistance('')
    setTime('')
    setDate(new Date().toISOString().split('T')[0])
    setElevationBoost(false)
    setSubmitError(null)
    resetOcr()
  }

  const inputClass =
    'w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm outline-none ring-ring transition-colors focus:bg-white focus:ring-2'

  // Success screen with compliment
  if (step === 'success') {
    return (
      <div className="flex flex-col items-center">
        {/* Hero image */}
        <div className="relative -mx-4 -mt-4 mb-6 w-[calc(100%+2rem)] overflow-hidden rounded-t-3xl">
          <img
            src={UPLOAD_HERO}
            alt=""
            className="h-48 w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-mint shadow-lg">
              <Flame className="h-8 w-8 text-brand-dark-petrol" />
            </div>
          </div>
        </div>

        <h2 className="text-center text-2xl font-black tracking-tight text-brand-dark-petrol">
          {compliment.headline}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {compliment.sub}
        </p>

        <div className="mt-6 w-full rounded-2xl bg-brand-dark-petrol/5 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">You just logged</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-brand-dark-petrol">
            {scoredDistance} <span className="text-lg font-bold">km</span>
          </p>
          {elevationBoost && (
            <div className="mt-1 flex items-center justify-center gap-1 text-xs text-brand-teal">
              <Mountain className="h-3 w-3" />
              <span>incl. elevation boost</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex w-full flex-col gap-2.5">
          <button
            onClick={() => navigate('/my-races')}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-dark-petrol font-bold text-white shadow-lg transition-all hover:shadow-xl"
          >
            View My Races
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="flex h-11 items-center justify-center rounded-xl border border-brand-dark-petrol/20 font-semibold text-brand-dark-petrol transition-colors hover:bg-brand-dark-petrol/5"
          >
            Log Another Race
          </button>
        </div>
      </div>
    )
  }

  if (step === 'upload') {
    return (
      <div className="flex flex-col gap-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-brand-dark-petrol/20 bg-brand-dark-petrol/5 p-10 transition-colors hover:border-brand-dark-petrol/40 hover:bg-brand-dark-petrol/10"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-dark-petrol/10">
            <Upload className="h-7 w-7 text-brand-dark-petrol/60" />
          </div>
          <div className="text-center">
            <p className="font-bold text-brand-dark-petrol">Upload Screenshot</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag & drop or tap to select from camera/gallery
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="relative flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="px-3 text-sm text-muted-foreground">or enter manually</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <button
          onClick={() => setStep('confirm')}
          className="rounded-xl border-2 border-brand-dark-petrol/20 py-3 text-sm font-bold text-brand-dark-petrol transition-colors hover:bg-brand-dark-petrol/5"
        >
          Enter Manually
        </button>
      </div>
    )
  }

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-dark-petrol/10">
          <Loader2 className="h-8 w-8 animate-spin text-brand-dark-petrol" />
        </div>
        <div className="text-center">
          <p className="font-bold text-brand-dark-petrol">Processing Screenshot...</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Extracting race data with OCR
          </p>
        </div>
        {preview && (
          <img
            src={preview}
            alt="Race screenshot"
            className="mt-4 max-h-48 rounded-2xl border border-border object-contain shadow-sm"
          />
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Race screenshot"
            className="max-h-36 rounded-2xl border border-border object-contain shadow-sm"
          />
        </div>
      )}

      {ocrResult && ocrResult.confidence < 50 && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Low OCR confidence. Please verify the extracted data.
        </div>
      )}

      <div>
        <label htmlFor="raceName" className="mb-1 block text-sm font-semibold text-foreground">
          Race Name
        </label>
        <input
          id="raceName"
          type="text"
          value={raceName}
          onChange={(e) => setRaceName(e.target.value)}
          placeholder="e.g., Vienna City Marathon"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="distance" className="mb-1 block text-sm font-semibold text-foreground">
            Distance (km)
          </label>
          <input
            id="distance"
            type="number"
            step="0.01"
            min="0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="10"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="time" className="mb-1 block text-sm font-semibold text-foreground">
            Time (HH:MM:SS)
          </label>
          <input
            id="time"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="1:23:45"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-semibold text-foreground">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="rounded-2xl border border-brand-mint/30 bg-brand-mint/5 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={elevationBoost}
            onChange={(e) => setElevationBoost(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border accent-brand-teal"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <Mountain className="h-4 w-4 text-brand-teal" />
              <span className="text-sm font-bold text-foreground">
                Elevation Boost (+10%)
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Was this a hilly/mountain race? Your scored distance gets a 10% bonus.
            </p>
            {elevationBoost && distanceNum > 0 && (
              <p className="mt-1.5 text-sm font-bold text-brand-teal">
                {distanceNum} km → {scoredDistance} km scored
              </p>
            )}
          </div>
        </label>
      </div>

      {submitError && (
        <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 rounded-xl border-2 border-border py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={createRace.isPending}
          className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-brand-dark-petrol py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
        >
          {createRace.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Save Race
        </button>
      </div>
    </form>
  )
}
