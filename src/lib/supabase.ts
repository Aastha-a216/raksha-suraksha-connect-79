import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client for demo mode if env vars are not set
const createMockSupabaseClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithOtp: () => Promise.resolve({ error: null }),
    verifyOtp: () => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }) }) }),
    upsert: () => Promise.resolve({ error: null })
  })
});

export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          blood_group: string | null
          language: string | null
          emergency_contacts: Array<{
            name: string
            phone: string
          }> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          blood_group?: string | null
          language?: string | null
          emergency_contacts?: Array<{
            name: string
            phone: string
          }> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          blood_group?: string | null
          language?: string | null
          emergency_contacts?: Array<{
            name: string
            phone: string
          }> | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}