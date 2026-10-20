import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { cn } from '@/shared/lib/cn';

const TABS = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/vehiculos', label: 'Vehículos' },
  { to: '/admin/catalogo', label: 'Marcas, modelos y colores' },
  { to: '/admin/pedidos', label: 'Pedidos' },
];

/** Marco común del panel de administración con navegación por pestañas. */
export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="container-page pt-10">
      <p className="text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">Administración</p>
      <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
      <nav className="mt-6 mb-8 flex gap-1 overflow-x-auto border-b border-line" aria-label="Secciones de administración">
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end}
            className={({ isActive }) => cn('-mb-px border-b-2 px-4 py-3 text-sm whitespace-nowrap',
              isActive ? 'border-brand-500 font-medium text-fg' : 'border-transparent text-fg-muted hover:text-fg')}>
            {tab.label}
          </NavLink>
        ))}
      </nav>
      {children}
    </div>
  );
}
