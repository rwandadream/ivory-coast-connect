import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

let supabaseInstance: SupabaseClient<Database> | null = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  // On essaie de récupérer les variables de plusieurs sources pour plus de sécurité
  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env?.VITE_SUPABASE_URL;
  const supabaseAnonKey =
    import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "CRITICAL: Supabase keys are missing! URL:",
      !!supabaseUrl,
      "Key:",
      !!supabaseAnonKey,
    );
    // On ne crash pas ici pour éviter l'erreur 500 immédiate, on laisse l'app tenter de charger
    if (!supabaseUrl || !supabaseAnonKey) return null;
  }

  try {
    supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
}

// Export d'un proxy pour garder la compatibilité avec l'import direct 'supabase'
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get: (target, prop) => {
    const instance = getSupabase();
    if (!instance) {
      console.warn(`Supabase instance not available while accessing: ${String(prop)}`);
      return undefined;
    }
    return instance[prop];
  },
});
