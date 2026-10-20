import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router';
import { buttonVariants } from '@/shared/ui/button';
import { MAX_COMPARE, useCompare } from './compare-store';

/** Barra flotante que aparece cuando el usuario marca autos para comparar. */
export function CompareBar() {
  const { ids, clear } = useCompare();
  return (
    <AnimatePresence>
      {ids.length > 0 && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-md items-center justify-between gap-3 rounded-full bg-ink-950 py-2 pr-2 pl-5 text-white shadow-lift">
          <span className="text-sm">{ids.length} de {MAX_COMPARE} para comparar</span>
          <div className="flex gap-1">
            <button type="button" onClick={clear} className="rounded-full px-3 text-sm text-white/70 hover:text-white">
              Quitar
            </button>
            <Link to="/comparar" className={buttonVariants({ size: 'sm' })}>Comparar</Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
