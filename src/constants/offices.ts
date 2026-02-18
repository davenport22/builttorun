export const OFFICES = [
  { name: 'Vienna', location: 'Vienna, Austria', colorTheme: '#00677F', country: 'AT' },
  { name: 'Berlin', location: 'Berlin, Germany', colorTheme: '#54DBC0', country: 'DE' },
  { name: 'Munich', location: 'Munich, Germany', colorTheme: '#249C97', country: 'DE' },
  { name: 'Hamburg', location: 'Hamburg, Germany', colorTheme: '#073C4E', country: 'DE' },
  { name: 'Cologne', location: 'Cologne, Germany', colorTheme: '#693355', country: 'DE' },
  { name: 'Bucharest', location: 'Bucharest, Romania', colorTheme: '#990F4F', country: 'RO' },
  { name: 'Stuttgart', location: 'Stuttgart, Germany', colorTheme: '#249C97', country: 'DE' },
] as const

export const RACE_SOURCES: Record<string, Array<{ name: string; url: string }>> = {
  AT: [
    { name: 'Laufkalender.at', url: 'https://www.laufkalender.at' },
    { name: 'Vienna City Marathon', url: 'https://www.vienna-marathon.com' },
    { name: 'RunAustria', url: 'https://www.runaustria.at' },
  ],
  DE: [
    { name: 'Laufkalender.de', url: 'https://www.laufkalender.de' },
    { name: 'Marathon.de', url: 'https://www.marathon.de' },
    { name: 'Laufen.de Events', url: 'https://www.laufen.de/laufevents' },
  ],
  RO: [
    { name: 'Bucharest Marathon', url: 'https://www.bucharest-marathon.com' },
    { name: 'Maratonul.ro', url: 'https://www.maratonul.ro' },
  ],
}
