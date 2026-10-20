import { expect, test } from '@playwright/test';

test('el onboarding de 3 pasos devuelve recomendaciones explicadas', async ({ page }) => {
  await page.goto('/descubre');
  await page.getByRole('button', { name: 'Mazda' }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByTitle('Rojo').click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Ver mis recomendaciones' }).click();
  const first = page.locator('article').first();
  await expect(first).toContainText('Mazda');
  await expect(first).toContainText('Coincide con tu');
});

test('el comparador resalta el mejor precio', async ({ page }) => {
  await page.goto('/autos');
  const buttons = page.getByRole('button', { name: 'Comparar' });
  await buttons.nth(0).click();
  await buttons.nth(1).click();
  await page.getByRole('link', { name: 'Comparar' }).last().click();
  await expect(page.getByRole('heading', { name: 'Comparador' })).toBeVisible();
  await expect(page.locator('td.text-success').first()).toBeVisible();
});
