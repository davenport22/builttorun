import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useAuth } from '@/providers/auth-provider'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { LOGIN_HERO } from '@/constants/images'

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)
    const { error } = await signIn(data.email, data.password)
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-dark-petrol">
      {/* Hero image */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={LOGIN_HERO}
          alt=""
          className="h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark-petrol/30 to-brand-dark-petrol" />
        <div className="absolute inset-x-0 bottom-6 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">BUILT TO RUN</h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-widest text-brand-mint">
            Build to Evolve
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="-mt-4 flex flex-1 flex-col items-center px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
          <h2 className="mb-6 text-center text-lg font-bold text-brand-dark-petrol">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-semibold text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm outline-none ring-ring transition-colors focus:bg-white focus:ring-2"
                placeholder="you@accilium.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-semibold text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm outline-none ring-ring transition-colors focus:bg-white focus:ring-2"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
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
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-dark-petrol hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
