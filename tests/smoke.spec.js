const { test, expect } = require('@playwright/test');

const pages = [
  { path: '/',               title: /Kansas City Bhangra/ },
  { path: '/about.html',     title: /About/ },
  { path: '/classes.html',   title: /Classes/ },
  { path: '/workshops.html', title: /Workshops/ },
  { path: '/performances.html', title: /Performances/ },
  { path: '/services.html',  title: /Services/ },
  { path: '/merch.html',     title: /Merch/ },
  { path: '/contact.html',   title: /Contact/ },
];

for (const { path, title } of pages) {
  test(`${path} loads with correct title`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
  });

  test(`${path} has no broken images`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    const broken = await page.evaluate(() => {
      return [...document.images]
        .filter(img => img.loading !== 'lazy' && (!img.complete || img.naturalWidth === 0))
        .map(img => img.src);
    });
    expect(broken, `Broken images on ${path}: ${broken.join(', ')}`).toHaveLength(0);
  });

  test(`${path} nav links are present`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('#nav')).toBeVisible();
  });
}

test('contact form fields exist', async ({ page }) => {
  await page.goto('/contact.html');
  await expect(page.locator('input[name="first_name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('select[name="subject"]')).toBeVisible();
  await expect(page.locator('.btn-submit')).toBeVisible();
});

test('mobile hamburger opens drawer', async ({ page, isMobile }) => {
  if (!isMobile) test.skip();
  await page.goto('/');
  await page.locator('#hamburger').click();
  await expect(page.locator('#nav-drawer')).toBeVisible();
});
