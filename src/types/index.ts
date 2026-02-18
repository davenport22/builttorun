export type { Database, Office, Profile, Race, RaceInsert, Event, EventInsert, Participation } from './database'
import type { Race, Profile, Office, Event } from './database'

export interface RaceWithProfile extends Race {
  profiles: Pick<Profile, 'name' | 'avatar_url'> & {
    offices: Pick<Office, 'name' | 'color_theme'> | null
  }
}

export interface LeaderboardEntry {
  user_id: string
  name: string
  avatar_url: string | null
  office_name: string | null
  office_color: string | null
  total_scored_distance: number
  total_races: number
}

export interface OfficeLeaderboardEntry {
  id: string
  name: string
  location: string
  color_theme: string | null
  member_count: number
  total_scored_distance: number
  total_races: number
}

export interface EventWithParticipants extends Event {
  participations: Array<{
    user_id: string
    status: string
    profiles: Pick<Profile, 'name' | 'avatar_url'>
  }>
}

export type Period = 'week' | 'month' | 'year' | 'all'
