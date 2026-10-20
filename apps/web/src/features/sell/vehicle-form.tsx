import type { CreateVehicleDto } from '@autos/contracts';
import { useState, type FormEvent } from 'react';
import { useCatalogOptions } from '@/shared/hooks/use-catalog';
import { Button } from '@/shared/ui/button';
import { Field, Input, Select } from '@/shared/ui/field';

interface VehicleFormProps {
  submitLabel: string;
  pending: boolean;
  onSubmit: (data: CreateVehicleDto) => void;
}

const TRANSMISSIONS = [{ value: 'automatic', label: 'Automática' }, { value: 'manual', label: 'Mecánica' }];

/** Formulario de registro de vehículo, compartido por clientes (vender) y admin (inventario). */
export function VehicleForm({ submitLabel, pending, onSubmit }: VehicleFormProps) {
  const [brandId, setBrandId] = useState('');
  const { brandOptions, modelOptions, colorOptions } = useCatalogOptions(brandId || undefined);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    onSubmit({
      modelId: f.modelId!, colorId: f.colorId!, year: Number(f.year), mileageKm: Number(f.mileageKm),
      transmission: f.transmission as CreateVehicleDto['transmission'], stock: Number(f.stock),
      price: Number(f.price), imageUrls: [], status: 'published',
    });
  };
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Marca"><Select options={brandOptions} placeholder="Elige" required value={brandId} onChange={(e) => setBrandId(e.target.value)} /></Field>
      <Field label="Modelo"><Select name="modelId" options={modelOptions} placeholder="Elige" required disabled={!brandId} /></Field>
      <Field label="Color"><Select name="colorId" options={colorOptions} placeholder="Elige" required /></Field>
      <Field label="Transmisión"><Select name="transmission" options={TRANSMISSIONS} required /></Field>
      <Field label="Año"><Input name="year" type="number" min={1990} max={2027} defaultValue={2026} required /></Field>
      <Field label="Kilometraje"><Input name="mileageKm" type="number" min={0} defaultValue={0} required /></Field>
      <Field label="Cantidad disponible"><Input name="stock" type="number" min={1} defaultValue={1} required /></Field>
      <Field label="Precio (COP)"><Input name="price" type="number" min={1000000} step={100000} required /></Field>
      <Button type="submit" size="lg" disabled={pending} className="sm:col-span-2">{pending ? 'Guardando…' : submitLabel}</Button>
    </form>
  );
}
