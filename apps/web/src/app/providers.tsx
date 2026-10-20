import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { createServices } from '@/shared/api/services';
import { ServicesProvider } from '@/shared/api/services-context';
import { AuthProvider } from '@/shared/auth/auth-provider';
import { getAccessToken } from '@/shared/auth/supabase-client';
import { env } from '@/shared/lib/env';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
});

const services = createServices(env.apiUrl, getAccessToken);

/** Composición de dependencias de la aplicación (Composition Root). */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ServicesProvider services={services}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </AuthProvider>
      </ServicesProvider>
    </QueryClientProvider>
  );
}
