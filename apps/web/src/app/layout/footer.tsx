import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-raised">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-fg-muted">
            Compra con datos: recomendaciones basadas en matrículas reales del mercado y en lo que
            más eligen nuestros clientes.
          </p>
        </div>
        <p className="text-xs text-fg-muted">
          Fuentes de mercado: datos abiertos de datos.gov.co (RUNT). © {new Date().getFullYear()} Rueda.
        </p>
      </div>
    </footer>
  );
}
