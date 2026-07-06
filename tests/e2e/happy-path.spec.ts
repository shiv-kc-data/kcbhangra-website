import { test, expect } from '@playwright/test';

const allPages = [
  { path: '/',                  label: 'Home' },
  { path: '/about.html',        label: 'About' },
  { path: '/classes.html',      label: 'Classes' },
  { path: '/workshops.html',    label: 'Workshops' },
  { path: '/performances.html', label: 'Performances' },
  { path: '/services.html',     label: 'Services' },
  { path: '/merch.html',        label: 'Merch' },
  { path: '/contact.html',      label: 'Contact' },
];

for (const { path, label } of allPages) {
  test(`${label} page loads without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(path);
    await expect(page.locator('#nav')).toBeVisible();
    expect(errors, `JS errors on ${path}: ${errors.join('; ')}`).toHaveLength(0);
  });

  test(`${label} page has working nav links`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Classes' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Workshops' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Performances' }).first()).toBeVisible();
  });
}

test('home page CTA links to classes enroll section', async ({ page }) => {
  await page.goto('/');
  const enrollLink = page.getByRole('link', { name: /enroll free/i }).first();
  await expect(enrollLink).toBeVisible();
  const href = await enrollLink.getAttribute('href');
  expect(href).toContain('classes.html#enroll');
});

test('clicking Classes nav link navigates to classes page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Classes' }).first().click();
  await expect(page).toHaveURL(/classes\.html/);
});

test('clicking About nav link navigates to about page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).first().click();
  await expect(page).toHaveURL(/about\.html/);
});

test('contact page WhatsApp link opens correctly', async ({ page }) => {
  await page.goto('/contact.html');
  const waLink = page.locator('a[href*="wa.me"]').first();
  const href = await waLink.getAttribute('href');
  expect(href).toContain('wa.me');
  expect(href).toContain('16464219634');
});

test('merch page shows product cards', async ({ page }) => {
  await page.goto('/merch.html');
  const cards = page.locator('.product-card');
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThan(0);
});

test('performances page shows video thumbnails linking to YouTube', async ({ page }) => {
  await page.goto('/performances.html');
  const videoLinks = page.getByRole('link', { name: /watch.*youtube/i });
  await expect(videoLinks.first()).toBeVisible();
  const href = await videoLinks.first().getAttribute('href');
  expect(href).toContain('youtu.be');
});
