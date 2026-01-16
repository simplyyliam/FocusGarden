import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_API_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  console.error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnon ?? "")