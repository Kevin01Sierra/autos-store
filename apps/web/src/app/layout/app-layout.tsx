import { Outlet, ScrollRestoration } from 'react-router';
import { Footer } from './footer';
import { Navbar } from './navbar';

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:p-3">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="flex-1 pb-20">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
