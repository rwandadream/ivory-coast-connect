import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!,
  );
}

export const supabase = createSupabaseBrowserClient();
