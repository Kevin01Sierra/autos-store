import type { Role } from '@autos/contracts';
import type { User } from '@supabase/supabase-js';
import { createContext, use } from 'react';

export interface Credentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthState {
  user: User | null;
  role: Role | null;
  loading: boolean;
  enabled: boolean;
  signIn(credentials: Credentials): Promise<void>;
  signUp(credentials: Credentials): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const auth = use(AuthContext);
  if (!auth) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return auth;
}
