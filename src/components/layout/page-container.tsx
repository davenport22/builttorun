import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('px-4 py-6 pb-24 mx-auto max-w-screen-lg', className)}>
      {children}
    </div>
  )
}
