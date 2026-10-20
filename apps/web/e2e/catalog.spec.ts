import { expect, test } from '@playwright/test';

test('el inicio muestra recomendaciones y el pulso del mercado', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Colombia compra');
  await expect(page.getByText('Lo más matriculado en Colombia')).toBeVisible();
  await expect(page.locator('article').first()).toBeVisible();
});

test('filtrar por color mantiene el filtro en la URL', async ({ page, isMobile }) => {
  await page.goto('/autos');
  if (isMobile) await page.getByRole('button', { name: 'Filtros' }).click();
  await page.locator('aside').getByTitle('Rojo').click();
  await expect(page).toHaveURL(/colorId=/);
  const colors = page.locator('article').getByText('Rojo', { exact: true });
  await expect(colors.first()).toBeVisible();
});

test('la ficha muestra precio, simulador y botón de compra', async ({ page }) => {
  await page.goto('/autos');
  await page.locator('article h3 a').first().click();
  await expect(page.getByText('Precio de contado')).toBeVisible();
  await expect(page.getByText('Simula tu financiación')).toBeVisible();
  await page.getByRole('button', { name: '24 meses' }).click();
  await expect(page.getByRole('button', { name: '24 meses' })).toHaveAttribute('aria-pressed', 'true');
});
