import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPage }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages === 1) return null;
  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Paginación">
      <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPage(page - 1)}
        aria-label="Página anterior">
        <ChevronLeft className="size-4" />
      </Button>
      <span className="tabular text-sm text-fg-muted">Página {page} de {pages}</span>
      <Button variant="outline" size="icon" disabled={page >= pages} onClick={() => onPage(page + 1)}
        aria-label="Página siguiente">
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
