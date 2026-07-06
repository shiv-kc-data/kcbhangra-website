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

  test(`${label} page has working nav links`, async ({ page, isMobile }) => {
    await page.goto(path);
    if (isMobile) {
      // Mobile/tablet: nav links hidden, hamburger + drawer used instead
      await expect(page.locator('#hamburger')).toBeVisible();
      await page.locator('#hamburger').click();
      const drawer = page.locator('#nav-drawer');
      await expect(drawer.getByRole('link', { name: 'About' })).toBeVisible();
      await expect(drawer.getByRole('link', { name: 'Classes' })).toBeVisible();
    } else {
      // Desktop: nav links visible in header
      const nav = page.locator('#nav');
      await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Classes' })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Workshops' })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Performances' })).toBeVisible();
    }
  });
}

test('home page primary CTA links to classes page', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    // Mobile: hero CTA is "Book Your Free Class →"
    const cta = page.getByRole('link', { name: /Book Your Free Class/i }).first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute('href');
    expect(href).toContain('classes.html');
  } else {
    // Desktop: nav has "Enroll Free" linking to classes.html#enroll
    const enrollLink = page.locator('#nav').getByRole('link', { name: /enroll free/i });
    await expect(enrollLink).toBeVisible();
    const href = await enrollLink.getAttribute('href');
    expect(href).toContain('classes.html#enroll');
  }
});

test('clicking Classes nav link navigates to classes page', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.locator('#hamburger').click();
    await page.locator('#nav-drawer').getByRole('link', { name: 'Classes' }).click();
  } else {
    await page.locator('#nav').getByRole('link', { name: 'Classes' }).click();
  }
  await expect(page).toHaveURL(/classes\.html/);
});

test('clicking About nav link navigates to about page', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.locator('#hamburger').click();
    await page.locator('#nav-drawer').getByRole('link', { name: 'About' }).click();
  } else {
    await page.locator('#nav').getByRole('link', { name: 'About' }).click();
  }
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
