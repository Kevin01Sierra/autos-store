import type { Role } from '@autos/contracts';
import type { User } from '@supabase/supabase-js';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthState, type Credentials } from './auth-context';
import { supabase } from './supabase-client';

async function fetchRole(userId: string): Promise<Role> {
  const { data } = await supabase!.from('profiles').select('role').eq('id', userId).single();
  return data?.role === 'admin' ? 'admin' : 'customer';
}

function fail(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = session?.user ?? null;
      setUser(next);
      if (!next) return void (setRole(null), setLoading(false));
      void fetchRole(next.id).then(setRole).finally(() => setLoading(false));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(() => ({
    user, role, loading, enabled: Boolean(supabase),
    signIn: async ({ email, password }: Credentials) =>
      fail((await supabase!.auth.signInWithPassword({ email, password })).error),
    signUp: async ({ email, password, fullName }: Credentials) =>
      fail((await supabase!.auth.signUp({ email, password, options: { data: { full_name: fullName } } })).error),
    signOut: async () => fail((await supabase!.auth.signOut()).error),
  }), [user, role, loading]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
