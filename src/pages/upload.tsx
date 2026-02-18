import { PageContainer } from '@/components/layout/page-container'
import { RaceUploadForm } from '@/components/races/race-upload-form'
import { UPLOAD_HERO } from '@/constants/images'

export default function UploadPage() {
  return (
    <PageContainer>
      {/* Hero section */}
      <div className="relative -mx-4 -mt-4 mb-6 overflow-hidden rounded-b-3xl">
        <img
          src={UPLOAD_HERO}
          alt=""
          className="h-36 w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-petrol via-brand-dark-petrol/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h1 className="text-xl font-extrabold text-white">Log a Race</h1>
          <p className="mt-0.5 text-xs font-medium text-brand-mint">Upload your screenshot or enter manually</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <RaceUploadForm />
      </div>
    </PageContainer>
  )
}
