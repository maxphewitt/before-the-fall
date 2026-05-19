import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase public env vars. Check .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

/**
 * Browser-safe Supabase client. Uses the anon (publishable) key.
 * Respects Row Level Security — without permissive RLS policies,
 * this client cannot read or write to our tables.
 *
 * Safe to import from client components.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-only Supabase client. Uses the service_role key, which bypasses RLS.
 *
 * NEVER import this from a client component or page. It must only be called
 * from server actions, route handlers, or server components. The function form
 * (instead of a const) ensures the service key is only resolved at runtime on
 * the server — Next.js will not bundle it into client code.
 */
export function supabaseServer() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. This function must only run on the server, and the env var must be set in .env.local locally and in Vercel for production."
    );
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
