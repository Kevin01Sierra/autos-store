import { useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/shared/auth/auth-context';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Field, Input } from '@/shared/ui/field';
import { useLogin, type AuthMode } from './use-login';

const COPY = {
  signIn: { title: 'Bienvenido de nuevo', submit: 'Ingresar', toggle: '¿No tienes cuenta? Regístrate', password: 'current-password' },
  signUp: { title: 'Crea tu cuenta', submit: 'Crear cuenta', toggle: '¿Ya tienes cuenta? Ingresa', password: 'new-password' },
};

export default function LoginPage() {
  const auth = useAuth();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';
  const [mode, setMode] = useState<AuthMode>('signIn');
  const { submit, pending } = useLogin(mode, from);
  const copy = COPY[mode];
  if (auth.user) return <Navigate to={from} replace />;
  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold">{copy.title}</h1>
        {!auth.enabled && <p className="mt-2 text-sm text-danger">Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar el acceso.</p>}
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          {mode === 'signUp' && <Field label="Nombre completo"><Input name="fullName" required autoComplete="name" /></Field>}
          <Field label="Correo"><Input name="email" type="email" required autoComplete="email" /></Field>
          <Field label="Contraseña" hint="Mínimo 8 caracteres">
            <Input name="password" type="password" minLength={8} required autoComplete={copy.password} />
          </Field>
          <Button type="submit" size="lg" disabled={pending || !auth.enabled}>{pending ? 'Un momento…' : copy.submit}</Button>
        </form>
        <button type="button" className="mt-4 w-full text-center text-sm text-fg-muted hover:text-fg"
          onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
          {copy.toggle}
        </button>
      </Card>
    </div>
  );
}
