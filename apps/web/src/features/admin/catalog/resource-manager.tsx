import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/feedback';
import type { ResourceConfig } from './resource-config';
import { ResourceForm } from './resource-form';

/** Componente genérico de administración: listar, crear y eliminar un recurso. */
export function ResourceManager<T extends { id: string }>({ config }: { config: ResourceConfig<T> }) {
  const client = useQueryClient();
  const api = config.api as unknown as {
    list: () => Promise<T[]>; create: (d: unknown) => Promise<T>; remove: (id: string) => Promise<void>;
  };
  const { data, isLoading } = useQuery({ queryKey: config.queryKey, queryFn: () => api.list() });
  const onSuccess = () => client.invalidateQueries({ queryKey: [config.queryKey[0]] });
  const onError = (error: Error) => toast.error(error.message);
  const create = useMutation({ mutationFn: api.create, onSuccess, onError });
  const remove = useMutation({ mutationFn: api.remove, onSuccess, onError });
  return (
    <Card className="overflow-hidden">
      <h2 className="px-4 pt-4 font-semibold">{config.title} <span className="text-fg-muted">({data?.length ?? 0})</span></h2>
      {isLoading ? <Skeleton className="m-4 h-32" /> : (
        <div className="max-h-80 overflow-y-auto">
          <table className="mt-2 w-full text-sm">
            <thead className="text-left text-xs text-fg-muted">
              <tr>{[...config.headers, ''].map((h) => <th key={h} className="px-4 py-2 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr key={item.id} className="border-t border-line/60">
                  {config.row(item).map((value, i) => <td key={i} className="px-4 py-2">{value}</td>)}
                  <td className="px-4 py-2 text-right">
                    <button type="button" aria-label="Eliminar" onClick={() => remove.mutate(item.id)}
                      className="text-fg-muted hover:text-danger"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ResourceForm fields={config.fields} pending={create.isPending} onSubmit={(values) => create.mutate(values)} />
    </Card>
  );
}
