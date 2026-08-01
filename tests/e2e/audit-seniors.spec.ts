import { test, expect, devices } from '@playwright/test';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..', '..');
const fileUrl = (p: string) => 'file://' + path.join(ROOT, p);

const PAGES = [
  'index.html', 'about.html', 'classes.html', 'workshops.html',
  'performances.html', 'services.html', 'merch.html', 'contact.html', 'seniors.html',
];

test.describe('KC Bhangra audit', () => {
  test('every page links to seniors.html in nav + drawer', async ({ page }) => {
    const problems: string[] = [];
    for (const p of PAGES) {
      await page.goto(fileUrl(p));
      const navLink = await page.locator('.nav-links a[href="seniors.html"]').count();
      const drawerLink = await page.locator('.nav-drawer a[href="seniors.html"]').count();
      if (navLink !== 1) problems.push(`${p}: nav-links seniors count=${navLink}`);
      if (drawerLink !== 1) problems.push(`${p}: nav-drawer seniors count=${drawerLink}`);
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('no horizontal overflow on mobile (iPhone 14)', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone 14'] });
    const page = await ctx.newPage();
    const problems: string[] = [];
    for (const p of PAGES) {
      await page.goto(fileUrl(p));
      await page.waitForTimeout(400);
      const res = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
      }));
      if (res.scrollW > res.clientW + 1) {
        problems.push(`${p}: scrollWidth ${res.scrollW} > clientWidth ${res.clientW}`);
      }
    }
    await ctx.close();
    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('seniors: anchor targets are not hidden under fixed header on mobile', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone 14'] });
    const page = await ctx.newPage();
    await page.goto(fileUrl('seniors.html'));
    await page.waitForTimeout(400);

    // height of the fixed chrome (announcement bar + nav)
    const chrome = await page.evaluate(() => {
      const bar = document.getElementById('announcement-bar')!;
      const nav = document.getElementById('nav')!;
      return {
        barH: bar.getBoundingClientRect().height,
        barBottom: bar.getBoundingClientRect().bottom,
        navTop: nav.getBoundingClientRect().top,
        navBottom: nav.getBoundingClientRect().bottom,
      };
    });
    console.log('MOBILE CHROME', JSON.stringify(chrome));

    // click the announcement-bar "Sign up" link, then check the form heading is visible
    await page.click('#announcement-bar a[href="#signup"]');
    await page.waitForTimeout(900);
    const after = await page.evaluate(() => {
      const sec = document.getElementById('signup')!;
      const nav = document.getElementById('nav')!;
      const tag = sec.querySelector('.section-tag') as HTMLElement;
      return {
        secTop: sec.getBoundingClientRect().top,
        tagTop: tag.getBoundingClientRect().top,
        navBottom: nav.getBoundingClientRect().bottom,
      };
    });
    console.log('AFTER ANCHOR CLICK', JSON.stringify(after));
    expect(after.tagTop, 'anchor content hidden under fixed nav').toBeGreaterThanOrEqual(after.navBottom - 1);
    await ctx.close();
  });

  test('seniors: announcement bar does not overlap nav on mobile', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone 14'] });
    const page = await ctx.newPage();
    await page.goto(fileUrl('seniors.html'));
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const bar = document.getElementById('announcement-bar')!.getBoundingClientRect();
      const nav = document.getElementById('nav')!.getBoundingClientRect();
      return { barBottom: bar.bottom, barH: bar.height, navTop: nav.top };
    });
    console.log('BAR/NAV', JSON.stringify(r));
    expect(r.barBottom, `bar (h=${r.barH}) overlaps nav`).toBeLessThanOrEqual(r.navTop + 1);
    await ctx.close();
  });

  test('seniors: hero heading not covered by fixed header on mobile', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone 14'] });
    const page = await ctx.newPage();
    await page.goto(fileUrl('seniors.html'));
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const h1 = document.querySelector('.page-header h1')!.getBoundingClientRect();
      const nav = document.getElementById('nav')!.getBoundingClientRect();
      return { h1Top: h1.top, navBottom: nav.bottom };
    });
    console.log('HERO', JSON.stringify(r));
    expect(r.h1Top, 'h1 under fixed nav').toBeGreaterThanOrEqual(r.navBottom - 1);
    await ctx.close();
  });

  test('seniors: form inputs are >=16px (no iOS auto-zoom) and tappable', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone 14'] });
    const page = await ctx.newPage();
    await page.goto(fileUrl('seniors.html'));
    const bad = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll('.signup-form input, .signup-form textarea, .signup-form select').forEach((el) => {
        const cs = getComputedStyle(el as HTMLElement);
        const fs = parseFloat(cs.fontSize);
        if (fs < 16) out.push(`${(el as HTMLInputElement).name}: ${fs}px`);
      });
      const btn = document.querySelector('.signup-form button[type=submit]') as HTMLElement;
      const r = btn.getBoundingClientRect();
      if (r.height < 44) out.push(`submit height ${r.height}`);
      return out;
    });
    expect(bad, bad.join('\n')).toEqual([]);
    await ctx.close();
  });

  test('seniors: video element configured for mobile autoplay', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone 14'] });
    const page = await ctx.newPage();
    await page.goto(fileUrl('seniors.html'));
    const v = await page.evaluate(() => {
      const el = document.querySelector('.header-video video') as HTMLVideoElement;
      if (!el) return null;
      return {
        muted: el.muted, autoplay: el.autoplay, loop: el.loop,
        playsinline: el.hasAttribute('playsinline'),
        preload: el.getAttribute('preload'),
        src: (el.querySelector('source') as HTMLSourceElement)?.getAttribute('src'),
      };
    });
    console.log('VIDEO', JSON.stringify(v));
    expect(v).not.toBeNull();
    expect(v!.muted && v!.autoplay && v!.loop && v!.playsinline).toBeTruthy();
    await ctx.close();
  });

  test('seniors: form posts to the correct Formspree endpoint', async ({ page }) => {
    await page.goto(fileUrl('seniors.html'));
    const action = await page.getAttribute('.signup-form', 'action');
    expect(action).toBe('https://formspree.io/f/xeeybovd');
    const method = await page.getAttribute('.signup-form', 'method');
    expect((method || '').toLowerCase()).toBe('post');
  });

  test('seniors: all internal links resolve to existing files', async ({ page }) => {
    await page.goto(fileUrl('seniors.html'));
    const hrefs = await page.$$eval('a[href]', els => els.map(e => e.getAttribute('href')!));
    const internal = hrefs.filter(h => h && !h.startsWith('http') && !h.startsWith('#') && !h.startsWith('mailto'));
    console.log('INTERNAL LINKS', JSON.stringify([...new Set(internal)]));
    const fs = require('fs');
    const missing = [...new Set(internal)].filter(h => !fs.existsSync(path.join(ROOT, h.split('#')[0])));
    expect(missing, 'missing: ' + missing.join(', ')).toEqual([]);
  });

  test('seniors: mobile drawer opens and closes', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone 14'] });
    const page = await ctx.newPage();
    await page.goto(fileUrl('seniors.html'));
    await expect(page.locator('#nav-drawer')).toBeHidden();
    await page.click('#hamburger');
    await expect(page.locator('#nav-drawer')).toBeVisible();
    await page.click('#drawer-close');
    await expect(page.locator('#nav-drawer')).toBeHidden();
    await ctx.close();
  });

  test('no page has duplicate element IDs', async ({ page }) => {
    const problems: string[] = [];
    for (const p of PAGES) {
      await page.goto(fileUrl(p));
      const dupes = await page.evaluate(() => {
        const seen: Record<string, number> = {};
        document.querySelectorAll('[id]').forEach(e => { seen[e.id] = (seen[e.id] || 0) + 1; });
        return Object.entries(seen).filter(([, n]) => n > 1).map(([id, n]) => `${id} x${n}`);
      });
      if (dupes.length) problems.push(`${p}: ${dupes.join(', ')}`);
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('no JS console errors on any page', async ({ browser }) => {
    // Errors raised by third-party embeds (the Google Maps iframe on contact.html)
    // are not our code, and fire asynchronously — so each page gets its own context.
    const THIRD_PARTY = /Could not load "(util|search_impl|[a-z_]+)"|googleapis|gstatic|maps\./i;
    const problems: string[] = [];
    for (const p of PAGES) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      const errs: string[] = [];
      page.on('pageerror', e => { if (!THIRD_PARTY.test(e.message)) errs.push(e.message); });
      await page.goto(fileUrl(p));
      await page.waitForTimeout(600);
      if (errs.length) problems.push(`${p}: ${errs.join(' | ')}`);
      await ctx.close();
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });
});
