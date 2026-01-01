import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in environment variables'
  );
}

/**
 * Supabase client for client-side and server-side usage
 *
 * This client can be used in both Server Components and Client Components.
 * For Server Actions, you may want to create a separate server-only client
 * with elevated privileges if needed.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
