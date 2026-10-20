import { LayoutDashboard, LogOut, Package, UserRound } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '@/shared/auth/auth-context';
import { buttonVariants } from '@/shared/ui/button';

const item = 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-sunken';

export function UserMenu() {
  const { user, role, signOut, enabled } = useAuth();
  if (!enabled) return null;
  if (!user) {
    return (
      <Link to="/ingresar" className={buttonVariants({ variant: 'dark', size: 'sm' })}>
        Ingresar
      </Link>
    );
  }
  return (
    <details className="relative">
      <summary className={buttonVariants({ variant: 'outline', size: 'icon' }) + ' list-none'}
        aria-label="Mi cuenta">
        <UserRound className="size-4" />
      </summary>
      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-surface-raised p-2 shadow-lift">
        <p className="truncate px-3 py-2 text-xs text-fg-muted">{user.email}</p>
        <Link to="/mis-pedidos" className={item}><Package className="size-4" /> Mis pedidos</Link>
        {role === 'admin' && (
          <Link to="/admin" className={item}><LayoutDashboard className="size-4" /> Administración</Link>
        )}
        <button type="button" onClick={() => void signOut()} className={`${item} w-full text-danger`}>
          <LogOut className="size-4" /> Cerrar sesión
        </button>
      </div>
    </details>
  );
}
