import { Link } from 'react-router-dom'
import { Mountain } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Mountain className="mb-4 h-16 w-16 text-brand-petrol/30" />
      <h1 className="mb-2 text-4xl font-bold text-brand-petrol">404</h1>
      <p className="mb-6 text-muted-foreground">Page not found. Looks like you went off-trail!</p>
      <Link
        to="/"
        className="rounded-md bg-brand-petrol px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark-petrol"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
