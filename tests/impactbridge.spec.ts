import { test, expect } from '@playwright/test';

test.describe('ImpactBridge Application & Security Tests', () => {
  test('initializes demo mode, loads hero banner, and verifies navbar branding', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/ImpactBridge/i);

    // Verify brand icon and label
    const brand = page.locator('#nav-brand');
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('ImpactBridge');

    // Verify nav links
    await expect(page.locator('a[data-view="dashboard"]')).toBeVisible();
    await expect(page.locator('a[data-view="needs"]')).toBeVisible();
    await expect(page.locator('a[data-view="volunteers"]')).toBeVisible();
  });

  test('SPA router activates corresponding view containers on hash change', async ({ page }) => {
    await page.goto('/');

    const views = ['dashboard', 'needs', 'volunteers', 'map', 'analytics', 'tracker'];

    for (const view of views) {
      await page.goto(`/#${view}`);
      const viewElement = page.locator(`#view-${view}`);
      await expect(viewElement).toHaveClass(/active/);
    }
  });

  test('community needs view renders active crises and priority badges', async ({ page }) => {
    await page.goto('/#needs');

    // Verify needs container renders items
    const needsContainer = page.locator('#needs-grid, .needs-container, #needs-list');
    await expect(needsContainer).toBeVisible();

    // Verify need cards exist in demo mode
    const needCards = page.locator('.need-card');
    await expect(needCards.first()).toBeVisible({ timeout: 5000 });

    const cardCount = await needCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    // Verify card content structure
    const firstCard = needCards.first();
    await expect(firstCard.locator('.need-title, h3, h4').first()).toBeVisible();
  });

  test('volunteer section renders matching cards and skills badges', async ({ page }) => {
    await page.goto('/#volunteers');

    const volunteersView = page.locator('#view-volunteers');
    await expect(volunteersView).toHaveClass(/active/);

    const volunteerCards = page.locator('.volunteer-card');
    await expect(volunteerCards.first()).toBeVisible({ timeout: 5000 });

    const count = await volunteerCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('XSS sanitization prevents execution of injected script tags', async ({ page }) => {
    await page.goto('/');

    // Verify GeminiAI.escapeHtml properly escapes malicious HTML payloads
    const testResult = await page.evaluate(() => {
      // @ts-expect-error global object access in browser context
      if (typeof window.GeminiAI !== 'undefined' && typeof window.GeminiAI.escapeHtml === 'function') {
        // @ts-expect-error global object access in browser context
        const escaped = window.GeminiAI.escapeHtml('<script>window.__xss_compromised = true;</script>');

        // Inject escaped content into test container
        const container = document.createElement('div');
        container.innerHTML = `<div class="ai-bubble">${escaped}</div>`;
        document.body.appendChild(container);

        return {
          escaped,
          // @ts-expect-error checking if injected script ran
          compromised: !!window.__xss_compromised,
        };
      }
      return { escaped: '', compromised: false };
    });

    expect(testResult.escaped).toContain('&lt;script&gt;');
    expect(testResult.escaped).not.toContain('<script>');
    expect(testResult.compromised).toBe(false);
  });
});
