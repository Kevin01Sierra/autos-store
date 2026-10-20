interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: { value?: number | string }[];
  format: (value: number) => string;
  labelFormat?: (label: string) => string;
}

/** Tooltip común: texto en tokens de tinta, nunca en el color de la serie. */
export function ChartTooltip({ active, label, payload, format, labelFormat }: ChartTooltipProps) {
  const value = payload?.[0]?.value;
  if (!active || value === undefined) return null;
  return (
    <div className="rounded-xl border border-line bg-surface-raised px-3 py-2 text-xs shadow-lift">
      <p className="text-fg-muted">{labelFormat ? labelFormat(String(label)) : label}</p>
      <p className="tabular mt-0.5 text-sm font-semibold text-fg">{format(Number(value))}</p>
    </div>
  );
}
