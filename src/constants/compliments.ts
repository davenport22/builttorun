export const COMPLIMENTS = [
  { headline: 'Absolute Machine!', sub: 'That pace is not human.' },
  { headline: 'Fucking Legend!', sub: 'The streets were not ready for you.' },
  { headline: 'Beast Mode!', sub: 'You just ate that distance alive.' },
  { headline: 'Unstoppable!', sub: "Wind couldn't even keep up with you." },
  { headline: 'Who Are You?!', sub: "Even Kipchoge would be impressed." },
  { headline: 'Pure Domination!', sub: 'The road owes you an apology.' },
  { headline: 'Proper Machine!', sub: 'Your legs are weapons of mass distance.' },
  { headline: 'Stone Cold Runner!', sub: "Other runners are filing complaints." },
  { headline: 'Built Different!', sub: 'This is what peak performance looks like.' },
  { headline: 'Menace to Society!', sub: 'The leaderboard is shaking right now.' },
  { headline: 'No Mercy!', sub: 'That was violent and we loved every km.' },
  { headline: 'Relentless!', sub: "Pain tried to stop you. Pain lost." },
] as const

export function getRandomCompliment() {
  return COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]
}
