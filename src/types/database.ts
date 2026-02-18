export interface Database {
  public: {
    Tables: {
      offices: {
        Row: {
          id: string
          name: string
          location: string
          color_theme: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          color_theme?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          color_theme?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          office_id: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          office_id?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          office_id?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          }
        ]
      }
      races: {
        Row: {
          id: string
          user_id: string
          race_name: string
          distance_km: number
          time_seconds: number
          date: string
          screenshot_url: string | null
          verified: boolean
          elevation_boost: boolean
          scored_distance_km: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          race_name: string
          distance_km: number
          time_seconds: number
          date: string
          screenshot_url?: string | null
          verified?: boolean
          elevation_boost?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          race_name?: string
          distance_km?: number
          time_seconds?: number
          date?: string
          screenshot_url?: string | null
          verified?: boolean
          elevation_boost?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "races_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          id: string
          name: string
          date: string
          location: string | null
          distance_km: number | null
          website_url: string | null
          is_suggested: boolean
          created_by: string | null
          office_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          location?: string | null
          distance_km?: number | null
          website_url?: string | null
          is_suggested?: boolean
          created_by?: string | null
          office_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          location?: string | null
          distance_km?: number | null
          website_url?: string | null
          is_suggested?: boolean
          created_by?: string | null
          office_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          }
        ]
      }
      participations: {
        Row: {
          event_id: string
          user_id: string
          status: string
          created_at: string
        }
        Insert: {
          event_id: string
          user_id: string
          status?: string
          created_at?: string
        }
        Update: {
          event_id?: string
          user_id?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Office = Database['public']['Tables']['offices']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Race = Database['public']['Tables']['races']['Row']
export type RaceInsert = Database['public']['Tables']['races']['Insert']
export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type Participation = Database['public']['Tables']['participations']['Row']
