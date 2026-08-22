// 20s test capture against the Liara docs-site fork (localhost:3002).
// 12s desktop + 8s mobile → captures/test/liara-*.webm
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:3002';
const OUT_DIR = resolve('captures/test');
mkdirSync(OUT_DIR, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function captureDesktop() {
  const ctx = await chromium.launchPersistentContext(`${OUT_DIR}/profile-l-desktop`, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: `${OUT_DIR}/desktop`, size: { width: 1440, height: 900 } },
  });
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
  await sleep(2500);
  // product link from the docs index → a real docs page
  const product = page.locator('a:has-text("پلتفرم")').first();
  if (await product.count()) {
    await product.click();
    await sleep(2500);
  }
  await page.mouse.wheel(0, 700);
  await sleep(2500);
  await page.mouse.wheel(0, 900);
  await sleep(2500);
  const video = page.video();
  await ctx.close();
  return video.path();
}

async function captureMobile() {
  const ctx = await chromium.launchPersistentContext(`${OUT_DIR}/profile-l-mobile`, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: `${OUT_DIR}/mobile`, size: { width: 390, height: 844 } },
  });
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
  await sleep(2000);
  const burger = page.locator('button[aria-label*="منو"], button:has-text("منو")').first();
  if (await burger.count()) {
    await burger.click();
    await sleep(2000);
  }
  await page.mouse.wheel(0, 800);
  await sleep(2000);
  await page.mouse.wheel(0, 800);
  await sleep(2000);
  const video = page.video();
  await ctx.close();
  return video.path();
}

const desktop = await captureDesktop();
const mobile = await captureMobile();
console.log(JSON.stringify({ desktop, mobile }));
