import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useAuth } from '@/providers/auth-provider'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { OFFICES } from '@/constants/offices'
import { LOGIN_HERO } from '@/constants/images'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .email('Please enter a valid email')
    .refine((email) => email.endsWith('@accilium.com'), {
      message: 'Only @accilium.com email addresses are allowed',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  officeName: z.string().optional(),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null)
    const { error } = await signUp(data.email, data.password, data.name, data.officeName)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm outline-none ring-ring transition-colors focus:bg-white focus:ring-2'

  return (
    <div className="flex min-h-screen flex-col bg-brand-dark-petrol">
      {/* Hero image */}
      <div className="relative h-56 w-full overflow-hidden">
        <img src={LOGIN_HERO} alt="" className="h-full w-full object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark-petrol/30 to-brand-dark-petrol" />
        <div className="absolute inset-x-0 bottom-6 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">BUILT TO RUN</h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-widest text-brand-mint">
            Build to Evolve
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="-mt-4 flex flex-1 flex-col items-center px-4 pb-8">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
          <h2 className="mb-5 text-center text-lg font-bold text-brand-dark-petrol">
            Join the Team
          </h2>

          {success ? (
            <div className="rounded-2xl bg-brand-mint/20 px-4 py-4 text-center text-sm font-semibold text-brand-dark-petrol">
              Account created! Redirecting to login...
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-semibold text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={inputClass}
                  placeholder="Your name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reg-email" className="mb-1 block text-sm font-semibold text-foreground">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  placeholder="you@accilium.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reg-password" className="mb-1 block text-sm font-semibold text-foreground">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="At least 6 characters"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="office" className="mb-1 block text-sm font-semibold text-foreground">
                  Office
                </label>
                <select id="office" className={inputClass} {...register('officeName')}>
                  <option value="">Select your office</option>
                  {OFFICES.map((office) => (
                    <option key={office.name} value={office.name}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 items-center justify-center rounded-xl bg-brand-dark-petrol font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-dark-petrol hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
