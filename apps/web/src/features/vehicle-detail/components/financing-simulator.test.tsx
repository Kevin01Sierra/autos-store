import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinancingSimulator, monthlyPayment } from './financing-simulator';

describe('monthlyPayment', () => {
  it('calcula la cuota con amortización francesa', () => {
    expect(Math.round(monthlyPayment(10_000_000, 12, 0.01))).toBe(888_488);
    expect(monthlyPayment(0, 12)).toBe(0);
  });
});

describe('FinancingSimulator', () => {
  it('recalcula la cuota al cambiar el plazo', () => {
    render(<FinancingSimulator price={100_000_000} />);
    const before = screen.getByText(/Cuota mensual/).nextSibling?.textContent;
    fireEvent.click(screen.getByRole('button', { name: '24 meses' }));
    const after = screen.getByText(/Cuota mensual/).nextSibling?.textContent;
    expect(after).not.toBe(before);
    expect(screen.getByRole('button', { name: '24 meses' })).toHaveAttribute('aria-pressed', 'true');
  });
});
