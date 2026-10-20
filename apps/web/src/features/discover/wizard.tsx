import type { PreferencesDto } from '@autos/contracts';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { BudgetStep } from './steps/budget-step';
import { ColorStep } from './steps/color-step';
import { VehicleStep, type StepProps } from './steps/vehicle-step';

const STEPS: { title: string; hint: string; Component: (props: StepProps) => React.ReactNode }[] = [
  { title: '¿Qué marcas te interesan?', hint: 'Elige hasta 5', Component: VehicleStep },
  { title: '¿De qué color lo imaginas?', hint: 'El color también cambia la recomendación', Component: ColorStep },
  { title: '¿Cuál es tu presupuesto?', hint: 'Precio de contado', Component: BudgetStep },
];

interface WizardProps {
  initial: PreferencesDto;
  onFinish: (preferences: PreferencesDto) => void;
}

export function Wizard({ initial, onFinish }: WizardProps) {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(initial);
  const current = STEPS[step]!;
  const last = step === STEPS.length - 1;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex gap-2" aria-label={`Paso ${step + 1} de ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <span key={s.title} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-brand-500' : 'bg-line'}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
          <p className="text-sm text-fg-muted">Paso {step + 1} · {current.hint}</p>
          <h2 className="mt-1 mb-6 text-3xl font-semibold">{current.title}</h2>
          <current.Component value={value} onChange={setValue} />
        </motion.div>
      </AnimatePresence>
      <div className="mt-10 flex justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Atrás</Button>
        <Button size="lg" onClick={() => (last ? onFinish(value) : setStep(step + 1))}>
          {last ? 'Ver mis recomendaciones' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
}
