import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { useAuth } from '@/providers/auth-provider'
import { useProfile, useUpdateProfile } from '@/hooks/use-profile'
import { useOffices } from '@/hooks/use-offices'
import { useNavigate } from 'react-router-dom'
import { LogOut, MapPin, Mail, Loader2, ChevronDown, Check } from 'lucide-react'
import type { Office } from '@/types'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { data: profile, isLoading } = useProfile()
  const { data: offices } = useOffices()
  const updateProfile = useUpdateProfile()
  const navigate = useNavigate()
  const [showOfficePicker, setShowOfficePicker] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleOfficeChange = async (officeId: string) => {
    await updateProfile.mutateAsync({ office_id: officeId })
    setShowOfficePicker(false)
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
        </div>
      </PageContainer>
    )
  }

  const currentOffice = profile?.offices as { id: string; name: string; location: string; color_theme: string | null } | null

  return (
    <PageContainer>
      <h1 className="mb-1 text-xl font-extrabold text-brand-dark-petrol">Profile</h1>
      <p className="mb-5 text-xs text-muted-foreground">Your account details</p>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-dark-petrol">
            <span className="text-xl font-black text-white">
              {profile?.name?.charAt(0)?.toUpperCase() ?? 'R'}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-brand-dark-petrol">
              {profile?.name ?? 'Runner'}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {user?.email}
            </div>
          </div>
        </div>

        {/* Office section */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Home Office
          </label>
          <button
            onClick={() => setShowOfficePicker(!showOfficePicker)}
            className="flex w-full items-center justify-between rounded-2xl bg-brand-dark-petrol/5 px-4 py-3.5 transition-colors hover:bg-brand-dark-petrol/10"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-teal" />
              {currentOffice ? (
                <>
                  <span className="text-sm font-bold text-brand-dark-petrol">
                    {currentOffice.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    — {currentOffice.location}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Select your office</span>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showOfficePicker ? 'rotate-180' : ''}`} />
          </button>

          {showOfficePicker && (
            <div className="mt-2 flex flex-col gap-1 rounded-2xl border border-border bg-white p-2 shadow-md">
              {(offices as Office[] | undefined)?.map((office) => {
                const isSelected = office.id === profile?.office_id
                return (
                  <button
                    key={office.id}
                    onClick={() => handleOfficeChange(office.id)}
                    disabled={updateProfile.isPending}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-brand-mint/15 font-bold text-brand-dark-petrol'
                        : 'text-foreground hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: office.color_theme ?? '#00677F' }}
                      />
                      <div>
                        <span className="font-bold">{office.name}</span>
                        <span className="ml-1.5 text-xs text-muted-foreground">{office.location}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-brand-teal" />}
                    {updateProfile.isPending && !isSelected && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-destructive/20 py-3 text-sm font-bold text-destructive transition-colors hover:bg-destructive/5"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </PageContainer>
  )
}
