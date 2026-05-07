import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4323';

const THEMES = [
  { id: 'espresso', bgVar: '#12100e' },
  { id: 'studio',   bgVar: '#faf8f5' },
  { id: 'midnight', bgVar: '#0d1526' },
  { id: 'rose',     bgVar: '#110e0e' },
];

test.describe('Theme switcher', () => {
  test('all 4 swatches are visible in the nav', async ({ page }) => {
    await page.goto(BASE);
    for (const { id } of THEMES) {
      await expect(page.locator(`[data-theme-btn="${id}"]`)).toBeVisible();
    }
  });

  test('clicking each swatch sets data-theme on <html>', async ({ page }) => {
    await page.goto(BASE);
    for (const { id } of THEMES) {
      await page.locator(`[data-theme-btn="${id}"]`).click();
      const theme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      expect(theme).toBe(id);
    }
  });

  test('active swatch gets data-active attribute', async ({ page }) => {
    await page.goto(BASE);
    for (const { id } of THEMES) {
      await page.locator(`[data-theme-btn="${id}"]`).click();
      await expect(page.locator(`[data-theme-btn="${id}"]`)).toHaveAttribute('data-active', '');
      // others should NOT be active
      for (const other of THEMES.filter(t => t.id !== id)) {
        await expect(page.locator(`[data-theme-btn="${other.id}"]`)).not.toHaveAttribute('data-active');
      }
    }
  });

  test('theme is persisted to localStorage', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('[data-theme-btn="midnight"]').click();
    const stored = await page.evaluate(() => localStorage.getItem('ev-theme'));
    expect(stored).toBe('midnight');
  });

  test('theme is restored from localStorage on reload', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('[data-theme-btn="rose"]').click();
    await page.reload();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('rose');
  });

  test('CSS tokens change when theme switches (bg colour)', async ({ page }) => {
    await page.goto(BASE);
    for (const { id, bgVar } of THEMES) {
      await page.locator(`[data-theme-btn="${id}"]`).click();
      // Read the CSS custom property directly — it updates synchronously, not via transition
      const bgToken = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
      );
      expect(bgToken).toBe(bgVar);
    }
  });

  test('theme persists across page navigation', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('[data-theme-btn="studio"]').click();
    await page.goto(`${BASE}/about/`);
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('studio');
  });
});
