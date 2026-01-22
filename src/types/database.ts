export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  profile_id: string
  name: string
  month: string
  status: 'processing' | 'completed' | 'failed'
  cosec_file_path: string | null
  bbhr_file_path: string | null
  output_file_path: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface ProcessingLog {
  id: string
  report_id: string
  status: string
  message: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      reports: {
        Row: Report
        Insert: Omit<Report, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Report, 'id' | 'created_at' | 'updated_at'>>
      }
      processing_logs: {
        Row: ProcessingLog
        Insert: Omit<ProcessingLog, 'id' | 'created_at'>
        Update: Partial<Omit<ProcessingLog, 'id' | 'created_at'>>
      }
    }
  }
}
