import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/lib/cn';
import { Button, buttonVariants } from '@/shared/ui/button';
import { Logo } from './logo';
import { NAV_LINKS } from './nav-links';
import { UserMenu } from './user-menu';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn('rounded-full px-3 py-2 text-sm transition-colors hover:text-fg',
    isActive ? 'text-fg font-medium' : 'text-fg-muted');

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-surface/80 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center gap-6" aria-label="Principal">
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>{link.label}</NavLink>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Cambiar tema">
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Link to="/vender" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'hidden sm:inline-flex')}>
            Vender mi auto
          </Link>
          <UserMenu />
          <Button variant="ghost" size="icon" className="md:hidden" aria-expanded={open}
            aria-label="Menú" onClick={() => setOpen(!open)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>
      {open && (
        <div className="container-page flex flex-col gap-1 pb-4 md:hidden">
          {[...NAV_LINKS, { to: '/vender', label: 'Vender mi auto' }].map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
