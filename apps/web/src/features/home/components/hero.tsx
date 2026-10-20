import { motion } from 'motion/react';
import { Link } from 'react-router';
import { CarIllustration } from '@/shared/ui/car-illustration';
import { QuickSearch } from './quick-search';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_20%,rgba(255,90,31,0.35),transparent)]" />
      <div className="container-page relative grid gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
            Recomendaciones con datos reales del RUNT
          </p>
          <h1 className="text-4xl leading-[1.05] font-semibold sm:text-6xl">
            El auto que eliges, respaldado por lo que <span className="text-brand-400">Colombia compra</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/70">
            Busca por marca, modelo y color. Te mostramos lo más popular del mercado y lo más
            vendido en nuestra tienda, con precio transparente.
          </p>
          <div className="mt-8 max-w-2xl"><QuickSearch /></div>
          <Link to="/descubre" className="mt-4 inline-block text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">
            ¿No sabes qué buscar? Descubre tu auto en 3 pasos →
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <CarIllustration bodyType="suv" color="#FF5A1F" label="SUV destacada" className="drop-shadow-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
