const { test, expect } = require('@playwright/test');

const { BRAINX_EMAIL, BRAINX_PASSWORD } = process.env;

test('login and take screenshot', async ({ page }) => {
  test.skip(!BRAINX_EMAIL || !BRAINX_PASSWORD, 'Set BRAINX_EMAIL and BRAINX_PASSWORD in .env');

  await page.goto('/login');
  await page.locator('#txtiSignInEmail').fill(BRAINX_EMAIL);
  await page.locator('#txtiSignInPassword').fill(BRAINX_PASSWORD);
  await page.locator('#btnLogin').click();

  await page.waitForLoadState('networkidle');
  await expect(page.locator('#txtiSignInPassword')).toHaveCount(0);

  await page.screenshot({ path: 'screenshots/after-login.png', fullPage: true });
});
