import { Link } from 'react-router';
import { buttonVariants } from '@/shared/ui/button';

export default function NotFoundPage() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-display text-7xl font-bold text-brand-500">404</p>
      <h1 className="text-2xl font-semibold">Esta página no está en el inventario</h1>
      <Link to="/autos" className={buttonVariants({ variant: 'dark' })}>
        Ver autos disponibles
      </Link>
    </section>
  );
}
