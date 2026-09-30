import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const origin = process.env.HED3505_PREVIEW_URL || 'http://127.0.0.1:4173/';
const sizes = [
  { name: 'iphone-small', width: 375, height: 812 },
  { name: 'iphone-large', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 }
];
await mkdir('test-artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const size of sizes) {
    const page = await browser.newPage({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1 });
    const response = await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!response?.ok()) throw new Error(size.name + ': HTTP preview failed');
    await page.locator('#signupForm').waitFor({ state: 'visible' });
    const checks = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
      workspaceHidden: document.getElementById('workspace').hidden,
      verifyHidden: document.getElementById('signupVerifyForm').hidden,
      title: document.title,
      passwordInput: document.getElementById('signupPassword').type,
      viewportWidth: window.innerWidth
    }));
    if (checks.overflow) throw new Error(size.name + ': horizontal overflow');
    if (!checks.workspaceHidden || !checks.verifyHidden) throw new Error(size.name + ': restricted panel exposed before login');
    if (checks.passwordInput !== 'password' || !checks.title.includes('HED3505')) throw new Error(size.name + ': missing form or title');
    await page.screenshot({ path: 'test-artifacts/' + size.name + '.png', fullPage: true });
    console.log(size.name + ': PASS ' + checks.viewportWidth + 'px; unauthenticated workspace hidden');
    await page.close();
  }
} finally {
  await browser.close();
}
