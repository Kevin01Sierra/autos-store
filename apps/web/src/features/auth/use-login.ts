import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/shared/auth/auth-context';

export type AuthMode = 'signIn' | 'signUp';

/** Lógica del formulario de acceso, separada de la vista. */
export function useLogin(mode: AuthMode, redirectTo: string) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setPending(true);
    try {
      await auth[mode]({ email: form.email!, password: form.password!, fullName: form.fullName });
      if (mode === 'signUp') toast.success('Cuenta creada. Revisa tu correo si te pedimos confirmarlo.');
      void navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPending(false);
    }
  };

  return { submit, pending };
}
