import type { FormEvent } from 'react';
import { Button } from '@/shared/ui/button';
import { Input, Select } from '@/shared/ui/field';
import type { FieldConfig } from './resource-config';

interface ResourceFormProps {
  fields: FieldConfig[];
  pending: boolean;
  onSubmit: (values: Record<string, string>) => void;
}

export function ResourceForm({ fields, pending, onSubmit }: ResourceFormProps) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    onSubmit(Object.fromEntries(new FormData(form)) as Record<string, string>);
    form.reset();
  };
  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2 border-t border-line p-4">
      {fields.map((f) => (
        <label key={f.name} className="flex min-w-36 flex-1 flex-col gap-1 text-xs text-fg-muted">
          {f.label}
          {f.type === 'select' ? (
            <Select name={f.name} options={f.options ?? []} placeholder="Elige" required className="h-9" />
          ) : (
            <Input name={f.name} type={f.type ?? 'text'} required className={f.type === 'color' ? 'h-9 p-1' : 'h-9'} />
          )}
        </label>
      ))}
      <Button type="submit" size="sm" disabled={pending}>Agregar</Button>
    </form>
  );
}
