// @ts-check
import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIX = join(__dirname, 'fixtures');
const ROOT = join(__dirname, '../..');

test.beforeAll(() => {
  execSync('node tests/e2e/generate-fixtures.mjs', { stdio: 'inherit', cwd: ROOT });
  for (const f of ['two-page-a.pdf', 'three-page-b.pdf', 'five-page.pdf', 'encrypted.pdf', 'large-105.pdf']) {
    if (!existsSync(join(FIX, f))) throw new Error('Missing fixture: ' + f);
  }
});

test('merge two PDFs', async ({ page }) => {
  await page.goto('/merge-pdf/');
  await page.locator('#merge-file-input').setInputFiles([
    join(FIX, 'two-page-a.pdf'),
    join(FIX, 'three-page-b.pdf'),
  ]);
  await expect(page.locator('.file-row')).toHaveCount(2);
  await page.locator('#btn-merge').click();
  await expect(page.locator('#merge-status.status-msg--ok')).toBeVisible({ timeout: 60_000 });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#btn-download').click(),
  ]);
  expect(download.suggestedFilename()).toBe('velotools-merged.pdf');
});

test('split PDF per page', async ({ page }) => {
  await page.goto('/split-pdf/');
  await page.locator('#split-file-input').setInputFiles(join(FIX, 'five-page.pdf'));
  await expect(page.locator('#btn-split')).toBeEnabled({ timeout: 30_000 });
  await page.locator('#btn-split').click();
  await expect(page.locator('#split-status.status-msg--ok')).toBeVisible({ timeout: 60_000 });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#btn-download').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/_split\.zip$/);
});

test('unlock encrypted PDF', async ({ page }) => {
  await page.goto('/unlock-pdf/');
  await page.locator('#unlock-file-input').setInputFiles(join(FIX, 'encrypted.pdf'));
  await page.locator('#unlock-password').fill('e2e-secret');
  await page.locator('#btn-unlock').click();
  await expect(page.locator('#unlock-status.status-msg--ok')).toBeVisible({ timeout: 30_000 });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#btn-download').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/_unlocked\.pdf$/);
});

test('compress single PDF', async ({ page }) => {
  await page.goto('/compress-pdf/');
  await page.locator('#file-input').setInputFiles(join(FIX, 'five-page.pdf'));
  await expect(page.locator('.file-card')).toHaveCount(1, { timeout: 15_000 });
  await page.locator('#btn-compress-all').click();
  await expect(page.locator('.fc-btn-dl')).toBeVisible({ timeout: 120_000 });
});

test('batch compress two PDFs', async ({ page }) => {
  await page.goto('/compress-pdf/');
  await page.locator('#file-input').setInputFiles([
    join(FIX, 'two-page-a.pdf'),
    join(FIX, 'three-page-b.pdf'),
  ]);
  await expect(page.locator('.file-card')).toHaveCount(2);
  await page.locator('#btn-compress-all').click();
  await expect(page.locator('.fc-btn-dl')).toHaveCount(2, { timeout: 120_000 });
  await expect(page.locator('#btn-download-all')).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#btn-download-all').click(),
  ]);
  expect(download.suggestedFilename()).toBe('velotools-compressed-pdfs.zip');
});

test('compress large 105-page PDF', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/compress-pdf/');
  await page.locator('[data-preset="screen"]').click();
  await page.locator('#file-input').setInputFiles(join(FIX, 'large-105.pdf'));
  await page.locator('#btn-compress-all').click();
  await expect(page.locator('.fc-btn-dl, #btn-download-all').first()).toBeVisible({
    timeout: 240_000,
  });
});

test('pdf to jpg all pages', async ({ page }) => {
  await page.goto('/pdf-to-jpg/');
  await page.locator('#jpg-file-input').setInputFiles(join(FIX, 'five-page.pdf'));
  await expect(page.locator('#btn-convert')).toBeEnabled({ timeout: 30_000 });
  await page.locator('#jpg-dpi').selectOption('96');
  await page.locator('#btn-convert').click();
  await expect(page.locator('#jpg-status.status-msg--ok')).toBeVisible({ timeout: 90_000 });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#btn-download').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/_jpg\.zip$/);
});
