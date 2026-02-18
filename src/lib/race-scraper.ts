const BASE_URL = 'https://www.runnersworld.de'
const CALENDAR_URL = `${BASE_URL}/laufkalender/?speakingUrl=laufevents&q=`
const PROXY_URL = 'https://api.allorigins.win/raw?url='

export interface ExternalRace {
  name: string
  date: string // e.g. "16 Feb 2026"
  location: string // e.g. "Neunkirchen"
  postalCode: string
  distances: string // e.g. "10 km, 5 km"
  url: string // full URL to detail page
}

/**
 * Fetch the Runners World Laufkalender HTML via a CORS proxy
 * and parse race entries from it.
 */
export async function fetchExternalRaces(page = 1): Promise<ExternalRace[]> {
  const calendarUrl = page === 1
    ? CALENDAR_URL
    : `${BASE_URL}/laufkalender/seite/${page}/?q=`

  const proxyUrl = `${PROXY_URL}${encodeURIComponent(calendarUrl)}`

  const res = await fetch(proxyUrl)
  if (!res.ok) throw new Error(`Proxy returned ${res.status}`)

  const html = await res.text()
  return parseRacesFromHtml(html)
}

/**
 * Parse race entries from the runnersworld.de Laufkalender HTML.
 *
 * Each race is an <a> linking to /laufkalender/slug/ with a date div,
 * a headline span, a subline span (location), and a distances <p>.
 */
export function parseRacesFromHtml(html: string): ExternalRace[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const links = doc.querySelectorAll<HTMLAnchorElement>(
    'a[href*="/laufkalender/"][class*="rwEventsCalendar"]'
  )

  const races: ExternalRace[] = []

  links.forEach((link) => {
    try {
      // Date: first div has two spans (day + "Mon. YYYY")
      const dateDiv = link.querySelector('div')
      const dateSpans = dateDiv?.querySelectorAll('span')
      const day = dateSpans?.[0]?.textContent?.trim() ?? ''
      const monthYear = dateSpans?.[1]?.textContent?.trim() ?? ''
      const date = `${day} ${monthYear}`.replace(/\.$/, '').trim()

      // Name: span with class va-headline > inner span
      const nameEl = link.querySelector('.va-headline span')
      const name = nameEl?.textContent?.trim() ?? ''

      // Location: span.va-subline (contains postal<!-- --> <!-- -->city)
      const locationEl = link.querySelector('.va-subline')
      const locationText = locationEl?.textContent?.trim() ?? ''
      // Split postal code from city name
      const postalMatch = locationText.match(/^(\d+)\s*(.*)$/)
      const postalCode = postalMatch?.[1] ?? ''
      const city = postalMatch?.[2] ?? locationText

      // Distances: the last <p> inside a "flex items-start" div
      const distDiv = link.querySelector('.flex.items-start')
      const distP = distDiv?.querySelector('p')
      const distances = distP?.textContent?.trim() ?? ''

      // URL
      const href = link.getAttribute('href') ?? ''
      const url = href.startsWith('http') ? href : `${BASE_URL}${href}`

      if (name) {
        races.push({ name, date, location: city, postalCode, distances, url })
      }
    } catch {
      // Skip malformed entries
    }
  })

  return races
}
