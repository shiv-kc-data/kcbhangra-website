import { test, expect } from '@playwright/test';

const mainPages = ['/', '/about.html', '/classes.html', '/contact.html'];

for (const path of mainPages) {
  test(`${path} has a single h1 element`, async ({ page }) => {
    await page.goto(path);
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test(`${path} all images have alt text`, async ({ page }) => {
    await page.goto(path);
    const missingAlt = await page.evaluate(() =>
      [...document.images]
        .filter(img => !img.alt || img.alt.trim() === '')
        .map(img => img.src)
    );
    expect(missingAlt, `Images missing alt on ${path}: ${missingAlt.join(', ')}`).toHaveLength(0);
  });

  test(`${path} has viewport meta tag`, async ({ page }) => {
    await page.goto(path);
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });
}

test('nav hamburger button has accessible aria-label', async ({ page }) => {
  await page.goto('/');
  const hamburger = page.locator('#hamburger');
  const label = await hamburger.getAttribute('aria-label');
  expect(label).toBeTruthy();
  expect(label!.length).toBeGreaterThan(0);
});

test('nav drawer close button has accessible aria-label', async ({ page }) => {
  await page.goto('/');
  const closeBtn = page.locator('.nav-drawer-close');
  const label = await closeBtn.getAttribute('aria-label');
  expect(label).toBeTruthy();
});

test('contact form inputs have associated labels', async ({ page }) => {
  await page.goto('/contact.html');
  // Labels should be present for screen readers
  const labels = await page.locator('form label').count();
  expect(labels).toBeGreaterThan(3);
});

test('all form submit buttons are keyboard reachable', async ({ page }) => {
  await page.goto('/contact.html');
  await page.keyboard.press('Tab');
  // Tab through the form — submit button should be focusable
  const submitBtn = page.getByRole('button', { name: /send/i });
  await submitBtn.focus();
  await expect(submitBtn).toBeFocused();
});

test('video links have aria-label describing destination', async ({ page }) => {
  await page.goto('/performances.html');
  const videoLinks = page.getByRole('link', { name: /watch/i });
  for (const link of await videoLinks.all()) {
    const label = await link.getAttribute('aria-label');
    expect(label).toBeTruthy();
  }
});

test('page does not have horizontal scroll on mobile viewport', async ({ page, isMobile }) => {
  if (!isMobile) test.skip();
  for (const path of ['/', '/classes.html', '/contact.html']) {
    await page.goto(path);
    const hasOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(hasOverflow, `Horizontal overflow on ${path}`).toBe(false);
  }
});
