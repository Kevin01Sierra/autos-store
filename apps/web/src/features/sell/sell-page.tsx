import type { CreateVehicleDto } from '@autos/contracts';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useServices } from '@/shared/api/services-context';
import { buttonVariants } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/feedback';
import { VehicleForm } from './vehicle-form';

export default function SellPage() {
  const { vehicles } = useServices();
  const register = useMutation({
    mutationFn: (data: CreateVehicleDto) => vehicles.register(data),
    onError: (error) => toast.error(error.message),
  });
  if (register.isSuccess) {
    return (
      <div className="container-page max-w-xl pt-16">
        <EmptyState icon={CheckCircle2} title="¡Recibimos tu auto!"
          description="Nuestro equipo lo revisará y lo publicará en el catálogo en menos de 24 horas."
          action={<Link to="/autos" className={buttonVariants()}>Ver catálogo</Link>} />
      </div>
    );
  }
  return (
    <div className="container-page max-w-2xl pt-12">
      <h1 className="text-3xl font-semibold">Vende tu auto</h1>
      <p className="mt-2 text-fg-muted">Registra tu vehículo; un asesor lo revisa antes de publicarlo.</p>
      <Card className="mt-8 p-6 sm:p-8">
        <VehicleForm submitLabel="Enviar a revisión" pending={register.isPending} onSubmit={(d) => register.mutate(d)} />
      </Card>
    </div>
  );
}
