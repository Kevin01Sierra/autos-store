/** Variables de entorno tipadas del frontend. */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
};
