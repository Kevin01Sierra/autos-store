import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../lib/env';

/** Cliente de Supabase; es null si faltan las variables (la tienda funciona sin login). */
export const supabase: SupabaseClient | null =
  env.supabaseUrl && env.supabaseAnonKey
    ? createClient(env.supabaseUrl, env.supabaseAnonKey)
    : null;

export const getAccessToken = async (): Promise<string | null> => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
};
