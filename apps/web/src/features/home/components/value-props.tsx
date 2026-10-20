import { BadgeCheck, ChartNoAxesColumn, Scale } from 'lucide-react';

const PROPS = [
  { icon: ChartNoAxesColumn, title: 'Datos reales, no intuición',
    text: 'Cruzamos matrículas oficiales del RUNT con las ventas de la tienda para recomendarte.' },
  { icon: Scale, title: 'Compara sin abrir diez pestañas',
    text: 'Pon hasta tres autos lado a lado y ve al instante cuál gana en precio, año y kilometraje.' },
  { icon: BadgeCheck, title: 'Precio transparente',
    text: 'Cada cambio de precio queda en el historial del vehículo. Sin sorpresas al pagar.' },
];

export function ValueProps() {
  return (
    <section className="container-page grid gap-6 pt-20 md:grid-cols-3">
      {PROPS.map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-card border border-line p-6">
          <Icon className="size-6 text-brand-500" aria-hidden />
          <h3 className="mt-4 text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-fg-muted">{text}</p>
        </div>
      ))}
    </section>
  );
}
