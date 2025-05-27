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
          role: 'user' | 'admin'
          username: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id: string
          role?: 'user' | 'admin'
          username?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'user' | 'admin'
          username?: string | null
          updated_at?: string
          created_at?: string
        }
      }
    }
  }
}