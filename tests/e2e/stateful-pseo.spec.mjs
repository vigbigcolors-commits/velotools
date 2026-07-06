// @ts-check
import { test, expect } from '@playwright/test';

test('compress-pdf-for-gmail pre-locks Web preset and shows intent banner', async ({ page }) => {
  await page.goto('/compress-pdf-for-gmail/');
  await expect(page.locator('#vt-intent-bar')).toBeVisible();
  await expect(page.locator('#vt-intent-bar')).toContainText('Gmail');
  await expect(page.locator('.preset-btn.act[data-preset="web"]')).toBeVisible();
  await expect(page.locator('.dpi-btn.act[data-dpi="96"]')).toBeVisible();
  await expect(page.locator('.preset-btn[data-preset="screen"]')).toBeDisabled();
  await expect(page.locator('#security')).toBeVisible();
});

test('compress-pdf-for-canvas pre-locks Screen preset and grayscale', async ({ page }) => {
  await page.goto('/compress-pdf-for-canvas/');
  await expect(page.locator('.preset-btn.act[data-preset="screen"]')).toBeVisible();
  await expect(page.locator('#opt-grayscale')).toBeChecked();
  await expect(page.locator('#opt-grayscale')).toBeDisabled();
});

test('image-resizer-for-amazon locks dimensions and shows banner', async ({ page }) => {
  await page.goto('/image-resizer-for-amazon/');
  await expect(page.locator('#vt-intent-bar')).toContainText('Amazon');
  await expect(page.locator('#v-rw')).toHaveValue('2000');
  await expect(page.locator('#v-rh')).toHaveValue('2000');
  await expect(page.locator('#security')).toBeVisible();
});
