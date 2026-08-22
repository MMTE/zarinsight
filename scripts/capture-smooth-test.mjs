// Smooth-capture test: eased scrolling, animated synthetic cursor with click ripple,
// 2x DPR source for post zoom. ~20s against the Liara docs fork.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:3002';
const OUT_DIR = resolve('captures/smooth');
mkdirSync(OUT_DIR, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CURSOR_CSS = [
  '#__cur { position: fixed; top: 0; left: 0; width: 22px; height: 22px;',
  '  margin: -11px 0 0 -11px; border-radius: 9999px; z-index: 2147483647;',
  '  background: rgba(10,51,255,.85); box-shadow: 0 0 0 3px rgba(255,255,255,.9), 0 2px 8px rgba(0,0,0,.25);',
  '  pointer-events: none; transition: transform .09s linear; }',
  '#__rip { position: fixed; z-index: 2147483646; pointer-events: none;',
  '  width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 9999px;',
  '  border: 3px solid rgba(10,51,255,.9); animation: __rip .55s ease-out forwards; }',
  '@keyframes __rip { from { transform: scale(.6); opacity: 1; } to { transform: scale(3.4); opacity: 0; } }'
].join('\n');

const CURSOR_INIT = `
(() => {
  const css = ${JSON.stringify(CURSOR_CSS)};
  const style = document.createElement('style');
  style.textContent = css;
  document.addEventListener('DOMContentLoaded', () => {
    const cur = document.createElement('div'); cur.id = '__cur';
    cur.style.transform = 'translate(-100px,-100px)';
    document.body.append(cur, style);
  });
  window.addEventListener('pointermove', (e) => {
    const cur = document.getElementById('__cur');
    if (cur) cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  }, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    const rip = document.createElement('div'); rip.id = '__rip';
    rip.style.left = e.clientX + 'px'; rip.style.top = e.clientY + 'px';
    document.body.appendChild(rip);
    setTimeout(() => rip.remove(), 600);
  }, { passive: true });
})();
`;

async function smoothScroll(page, targetY, duration) {
  await page.evaluate(([target, dur]) => new Promise((res) => {
    const el = document.scrollingElement ?? document.documentElement;
    const start = el.scrollTop;
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      el.scrollTop = start + (target - start) * ease(p);
      if (p < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  }), [targetY, duration]);
}

async function glideCursor(page, x, y, duration) {
  const from = await page.evaluate(() => ({
    x: window.__curX ?? Math.round(innerWidth / 2),
    y: window.__curY ?? Math.round(innerHeight / 2)
  }));
  const steps = Math.max(12, Math.round(duration / 16));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    await page.mouse.move(from.x + (x - from.x) * e, from.y + (y - from.y) * e);
    await sleep(duration / steps);
  }
  await page.evaluate(([cx, cy]) => { window.__curX = cx; window.__curY = cy; }, [x, y]);
}

async function smoothClick(page, selector, { moveDur = 900 } = {}) {
  const box = await page.locator(selector).first().boundingBox();
  if (!box) return false;
  await glideCursor(page, box.x + box.width / 2, box.y + box.height / 2, moveDur);
  await sleep(120);
  await page.mouse.down();
  await sleep(90);
  await page.mouse.up();
  return true;
}

async function captureDesktop() {
  const ctx = await chromium.launchPersistentContext(`${OUT_DIR}/profile-desktop`, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    recordVideo: { dir: `${OUT_DIR}/desktop`, size: { width: 2880, height: 1800 } },
  });
  await ctx.addInitScript(CURSOR_INIT);
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
  await sleep(2200);

  await smoothScroll(page, 650, 1800);
  await sleep(400);
  await smoothScroll(page, 1250, 2000);
  await sleep(600);

  const clicked = await smoothClick(page, 'a:has-text("پلتفرم")', { moveDur: 1100 });
  await sleep(2600);
  if (!clicked) await sleep(1200);

  await smoothScroll(page, 400, 1600);
  await sleep(300);
  await smoothScroll(page, 1100, 2200);
  await sleep(900);

  const video = page.video();
  await ctx.close();
  return video.path();
}

async function captureMobile() {
  const ctx = await chromium.launchPersistentContext(`${OUT_DIR}/profile-mobile`, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: `${OUT_DIR}/mobile`, size: { width: 780, height: 1688 } },
  });
  await ctx.addInitScript(CURSOR_INIT);
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
  await sleep(1800);
  await smoothScroll(page, 700, 1600);
  await sleep(300);
  await smoothScroll(page, 1600, 1800);
  await sleep(1200);
  const video = page.video();
  await ctx.close();
  return video.path();
}

const desktop = await captureDesktop();
const mobile = await captureMobile();
console.log(JSON.stringify({ desktop, mobile }));
