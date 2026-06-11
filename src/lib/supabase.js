import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://urzdxrjysxgayygqafsc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyemR4cmp5c3hnYXl5Z3FhZnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzI4NTIsImV4cCI6MjA5MzY0ODg1Mn0.H_D_wY13OuYwttsV75ri2irhiv5r46kzXfiMP4yMl9I"

// This will print to your terminal (not browser) to help us find the error
if (!supabaseUrl || !supabaseAnonKey) {
  console.log("❌ ERROR: Supabase Keys are missing from .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)