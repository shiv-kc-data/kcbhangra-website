import { test, expect } from '@playwright/test';

test('announcement bar can be dismissed', async ({ page }) => {
  await page.goto('/');
  const bar = page.locator('#announcement-bar');
  await expect(bar).toBeVisible();
  await page.getByRole('button', { name: /dismiss/i }).click();
  await expect(bar).toBeHidden();
});

test('mobile drawer opens and closes correctly', async ({ page, isMobile }) => {
  if (!isMobile) test.skip();
  await page.goto('/');
  await page.locator('#hamburger').click();
  const drawer = page.locator('#nav-drawer');
  await expect(drawer).toBeVisible();
  await page.locator('#drawer-close').click({ force: true });
  await expect(drawer).toBeHidden();
});

test('mobile drawer contains all nav links', async ({ page, isMobile }) => {
  if (!isMobile) test.skip();
  await page.goto('/');
  await page.locator('#hamburger').click();
  const drawer = page.locator('#nav-drawer');
  await expect(drawer.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(drawer.getByRole('link', { name: 'Classes' })).toBeVisible();
  await expect(drawer.getByRole('link', { name: 'Workshops' })).toBeVisible();
  await expect(drawer.getByRole('link', { name: 'Performances' })).toBeVisible();
  await expect(drawer.getByRole('link', { name: 'Merch' })).toBeVisible();
});

test('pages have no broken eager-load images', async ({ page }) => {
  const paths = ['/', '/about.html', '/classes.html', '/merch.html', '/contact.html', '/services.html'];
  for (const path of paths) {
    await page.goto(path);
    const broken = await page.evaluate(() =>
      [...document.images]
        .filter(img => img.loading !== 'lazy' && (!img.complete || img.naturalWidth === 0))
        .map(img => img.src)
    );
    expect(broken, `Broken images on ${path}: ${broken.join(', ')}`).toHaveLength(0);
  }
});

test('workshop tab switcher shows correct panel on click', async ({ page }) => {
  await page.goto('/workshops.html');
  const b2bTab = page.getByRole('button', { name: /bring us to your event/i });
  await b2bTab.click();
  const b2bSection = page.locator('#b2b');
  await expect(b2bSection).toBeVisible();
});

test('classes page enroll section is reachable via anchor', async ({ page }) => {
  await page.goto('/classes.html#enroll');
  const enrollSection = page.locator('#enroll');
  await expect(enrollSection).toBeAttached();
  // GSAP animates elements in — verify section exists and scroll works
  await enrollSection.scrollIntoViewIfNeeded();
  await expect(enrollSection).toBeVisible();
});

test('footer links are not broken placeholders', async ({ page }) => {
  await page.goto('/');
  const footerLinks = page.locator('footer').getByRole('link');
  for (const link of await footerLinks.all()) {
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull();
    expect(href).not.toBe('#');
    expect(href).not.toContain('XXXXXXXXXX');
  }
});
