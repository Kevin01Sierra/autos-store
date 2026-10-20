import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { buttonVariants } from '@/shared/ui/button';

export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? error.statusText : 'Ocurrió un error inesperado';
  return (
    <main className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">Algo se desvió del camino</h1>
      <p className="text-fg-muted">{message}</p>
      <Link to="/" className={buttonVariants()}>
        Volver al inicio
      </Link>
    </main>
  );
}
