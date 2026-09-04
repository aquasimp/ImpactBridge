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

    // Verify hero CTA button exists on landing page
    const heroCta = page.locator('.at-hero-cta a[href="#dashboard"]');
    await expect(heroCta).toBeVisible();

    // Navigating into the application reveals the full app navigation bar
    await heroCta.click();
    await expect(page).toHaveURL(/#dashboard/);

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
    const needsGrid = page.locator('#needs-grid');
    await expect(needsGrid).toBeVisible();

    // Verify need cards exist in demo mode
    const needCards = page.locator('.need-card');
    await expect(needCards.first()).toBeVisible({ timeout: 5000 });

    const cardCount = await needCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    // Verify card title and category badge structure
    const firstCard = needCards.first();
    await expect(firstCard.locator('.need-card-title')).toBeVisible();
    await expect(firstCard.locator('.need-card-header .badge')).toBeVisible();
  });

  test('volunteer section renders matching cards and skills badges', async ({ page }) => {
    await page.goto('/#volunteers');

    const volunteersView = page.locator('#view-volunteers');
    await expect(volunteersView).toHaveClass(/active/);

    const volunteerCards = page.locator('.volunteer-card');
    await expect(volunteerCards.first()).toBeVisible({ timeout: 5000 });

    const count = await volunteerCards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstVol = volunteerCards.first();
    await expect(firstVol.locator('.volunteer-name')).toBeVisible();
  });

  test('XSS sanitization prevents execution of injected script tags', async ({ page }) => {
    await page.goto('/');

    // Verify GeminiAI.escapeHtml properly escapes malicious HTML payloads
    const testResult = await page.evaluate(() => {
      // @ts-expect-error global object access in browser context
      const ai = window.GeminiAI || (window.ImpactBridge && window.ImpactBridge.gemini);
      if (ai && typeof ai.escapeHtml === 'function') {
        const escaped = ai.escapeHtml('<script>window.__xss_compromised = true;</script>');

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

  test('modal dialog accessibility supports ESC key dismissal and aria attributes', async ({ page }) => {
    await page.goto('/#volunteers');

    // Open volunteer registration modal
    const registerBtn = page.getByRole('button', { name: /register volunteer/i });
    await expect(registerBtn).toBeVisible();
    await registerBtn.click();

    const modal = page.locator('#modal-register-volunteer');
    await expect(modal).toHaveClass(/active/);
    await expect(modal).toHaveAttribute('aria-modal', 'true');

    // Dismiss with Escape key
    await page.keyboard.press('Escape');
    await expect(modal).not.toHaveClass(/active/);
  });
});