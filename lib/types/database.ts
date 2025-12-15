export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          desired_annual_income: number | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          desired_annual_income?: number | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          desired_annual_income?: number | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          company_name: string
          position_title: string | null
          source: 'agent' | 'direct' | 'self' | 'referral' | 'other'
          stage: 'research' | 'applied' | 'screening' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
          priority: number | null
          status_note: string | null
          archived: boolean
          selection_phase: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          position_title?: string | null
          source: 'agent' | 'direct' | 'self' | 'referral' | 'other'
          stage?: 'research' | 'applied' | 'screening' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
          priority?: number | null
          status_note?: string | null
          archived?: boolean
          selection_phase?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          position_title?: string | null
          source?: 'agent' | 'direct' | 'self' | 'referral' | 'other'
          stage?: 'research' | 'applied' | 'screening' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
          priority?: number | null
          status_note?: string | null
          archived?: boolean
          selection_phase?: number
          created_at?: string
          updated_at?: string
        }
      }
      application_events: {
        Row: {
          id: string
          user_id: string
          application_id: string
          title: string | null
          kind: 'casual_talk' | 'screening_call' | 'interview_1st' | 'interview_2nd' | 'interview_3rd' | 'interview_final' | 'offer_meeting' | 'other'
          starts_at: string
          ends_at: string | null
          location: string | null
          outcome: 'scheduled' | 'done' | 'cancelled' | 'no_show' | 'unknown'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          application_id: string
          title?: string | null
          kind?: 'casual_talk' | 'screening_call' | 'interview_1st' | 'interview_2nd' | 'interview_3rd' | 'interview_final' | 'offer_meeting' | 'other'
          starts_at: string
          ends_at?: string | null
          location?: string | null
          outcome?: 'scheduled' | 'done' | 'cancelled' | 'no_show' | 'unknown'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          application_id?: string
          title?: string | null
          kind?: 'casual_talk' | 'screening_call' | 'interview_1st' | 'interview_2nd' | 'interview_3rd' | 'interview_final' | 'offer_meeting' | 'other'
          starts_at?: string
          ends_at?: string | null
          location?: string | null
          outcome?: 'scheduled' | 'done' | 'cancelled' | 'no_show' | 'unknown'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      growth_logs: {
        Row: {
          id: string
          user_id: string
          title: string
          category: 'input' | 'output' | 'community' | 'project' | 'other'
          type: 'study_session' | 'conference' | 'reading' | 'talk' | 'article' | 'side_project' | 'certification' | 'other'
          source: 'manual' | 'google_calendar' | 'imported' | 'other'
          starts_at: string
          ends_at: string | null
          location: string | null
          impact_score: number | null
          reflection: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: 'input' | 'output' | 'community' | 'project' | 'other'
          type?: 'study_session' | 'conference' | 'reading' | 'talk' | 'article' | 'side_project' | 'certification' | 'other'
          source?: 'manual' | 'google_calendar' | 'imported' | 'other'
          starts_at: string
          ends_at?: string | null
          location?: string | null
          impact_score?: number | null
          reflection?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: 'input' | 'output' | 'community' | 'project' | 'other'
          type?: 'study_session' | 'conference' | 'reading' | 'talk' | 'article' | 'side_project' | 'certification' | 'other'
          source?: 'manual' | 'google_calendar' | 'imported' | 'other'
          starts_at?: string
          ends_at?: string | null
          location?: string | null
          impact_score?: number | null
          reflection?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
