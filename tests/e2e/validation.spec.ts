import { test, expect } from '@playwright/test';

test('contact form requires first name before submission', async ({ page }) => {
  await page.goto('/contact.html');
  await page.getByLabel('Last name').fill('Test');
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByRole('button', { name: /send/i }).click();
  // First name is required — form should not navigate away
  await expect(page).toHaveURL(/contact\.html/);
});

test('contact form requires email before submission', async ({ page }) => {
  await page.goto('/contact.html');
  await page.getByLabel('First name').fill('Test');
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page).toHaveURL(/contact\.html/);
});

test('classes enroll form requires name before submission', async ({ page }) => {
  await page.goto('/classes.html');
  await page.locator('#enroll').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: /claim.*spot|enroll|submit/i }).click();
  await expect(page).toHaveURL(/classes\.html/);
});

test('contact form subject dropdown has selectable options', async ({ page }) => {
  await page.goto('/contact.html');
  const select = page.locator('select[name="subject"]');
  await expect(select).toBeVisible();
  const options = await select.locator('option').count();
  expect(options).toBeGreaterThan(1);
});

test('external links on contact page open in new tab with noopener', async ({ page }) => {
  await page.goto('/contact.html');
  const externalLinks = page.locator('a[target="_blank"]');
  for (const link of await externalLinks.all()) {
    const rel = await link.getAttribute('rel');
    expect(rel, `Missing noopener on ${await link.getAttribute('href')}`).toContain('noopener');
  }
});

test('workshops page Rallly poll link is present and points to correct URL', async ({ page }) => {
  await page.goto('/workshops.html');
  await page.getByRole('button', { name: /pick a night/i }).click();
  const pollLink = page.getByRole('link', { name: /open poll/i });
  await expect(pollLink).toBeVisible();
  const href = await pollLink.getAttribute('href');
  expect(href).toContain('rallly.co/invite/lXVo8XfPd7WR');
  const target = await pollLink.getAttribute('target');
  expect(target).toBe('_blank');
});
