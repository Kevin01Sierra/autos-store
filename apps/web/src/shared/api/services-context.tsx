import { createContext, use, type ReactNode } from 'react';
import type { Services } from './services';

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({ services, children }: { services: Services; children: ReactNode }) {
  return <ServicesContext value={services}>{children}</ServicesContext>;
}

/** Hook de inyección de dependencias: los componentes piden servicios, no los crean. */
export function useServices(): Services {
  const services = use(ServicesContext);
  if (!services) throw new Error('useServices debe usarse dentro de ServicesProvider');
  return services;
}
