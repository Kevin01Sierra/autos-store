import type { Role } from '@autos/contracts';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/shared/auth/auth-context';
import { Skeleton } from '@/shared/ui/feedback';

/** Protege rutas: exige sesión y, opcionalmente, un rol. */
export function RequireAuth({ role }: { role?: Role }) {
  const { user, role: current, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Skeleton className="container-page mt-10 h-64" />;
  if (!user) return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />;
  if (role && current !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
