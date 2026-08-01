import { test, expect, devices } from '@playwright/test';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..', '..');
const fileUrl = (p: string) => 'file://' + path.join(ROOT, p);
const PAGES = ['index.html','about.html','classes.html','workshops.html','performances.html','services.html','merch.html','contact.html','seniors.html'];
const DEVICES = ['iPhone SE','iPhone 14','Pixel 7','iPad (gen 7)'] as const;

for (const dev of DEVICES) {
  test(`hero clears fixed header on ${dev}`, async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices[dev] });
    const page = await ctx.newPage();
    const problems: string[] = [];
    for (const p of PAGES) {
      await page.goto(fileUrl(p));
      await page.waitForTimeout(500);
      const r = await page.evaluate(() => {
        const nav = document.getElementById('nav')!.getBoundingClientRect();
        const h1 = document.querySelector('h1');
        if (!h1) return null;
        const hb = h1.getBoundingClientRect();
        return { h1Top: Math.round(hb.top), navBottom: Math.round(nav.bottom) };
      });
      if (r && r.h1Top < r.navBottom) {
        problems.push(`${dev} ${p}: h1 top=${r.h1Top} is under nav bottom=${r.navBottom} (clipped by ${r.navBottom - r.h1Top}px)`);
      }
    }
    await ctx.close();
    expect(problems, '\n' + problems.join('\n')).toEqual([]);
  });
}

test('desktop layout unchanged: hero clears header at 1440x900', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const problems: string[] = [];
  for (const p of PAGES) {
    await page.goto(fileUrl(p));
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const nav = document.getElementById('nav')!.getBoundingClientRect();
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      return { h1Top: Math.round(h1.getBoundingClientRect().top), navBottom: Math.round(nav.bottom) };
    });
    if (r && r.h1Top < r.navBottom) problems.push(`${p}: h1 ${r.h1Top} < nav ${r.navBottom}`);
  }
  await ctx.close();
  expect(problems, '\n' + problems.join('\n')).toEqual([]);
});

test('dismissing the announcement bar re-syncs the nav position', async ({ browser }) => {
  const ctx = await browser.newContext({ ...devices['iPhone SE'] });
  const page = await ctx.newPage();
  await page.goto(fileUrl('seniors.html'));
  await page.waitForTimeout(500);
  const before = await page.evaluate(() => document.getElementById('nav')!.getBoundingClientRect().top);
  await page.click('#announcement-bar button');
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => document.getElementById('nav')!.getBoundingClientRect().top);
  console.log(`nav top before dismiss=${before} after=${after}`);
  expect(before).toBeGreaterThan(0);
  expect(after).toBe(0);
  await ctx.close();
});
