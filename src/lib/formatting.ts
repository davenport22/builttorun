export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function parseTimeToSeconds(timeStr: string): number | null {
  const parts = timeStr.split(':').map(Number)
  if (parts.some(isNaN)) return null

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  return null
}

export function formatDistance(km: number): string {
  return km % 1 === 0 ? `${km}` : km.toFixed(2)
}

export function formatPace(distanceKm: number, timeSeconds: number): string {
  if (distanceKm <= 0) return '-'
  const paceSeconds = timeSeconds / distanceKm
  const minutes = Math.floor(paceSeconds / 60)
  const seconds = Math.round(paceSeconds % 60)
  return `${minutes}:${String(seconds).padStart(2, '0')} /km`
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateRelative(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDateShort(d)
}
