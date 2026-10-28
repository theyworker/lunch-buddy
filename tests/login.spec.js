const { test, expect } = require('@playwright/test');

const { BRAINX_EMAIL, BRAINX_PASSWORD, FOOD_TYPE = 'Chicken' } = process.env;
const FOOD_TYPES = ['Chicken', 'Fish', 'Vegetable'];

test('login and take screenshot', async ({ page }) => {
  test.skip(!BRAINX_EMAIL || !BRAINX_PASSWORD, 'Set BRAINX_EMAIL and BRAINX_PASSWORD in .env');

  expect(FOOD_TYPES, 'FOOD_TYPE must be Chicken, Fish or Vegetable').toContain(FOOD_TYPE);

  await page.goto('/login');
  await page.locator('#txtiSignInEmail').fill(BRAINX_EMAIL);
  await page.locator('#txtiSignInPassword').fill(BRAINX_PASSWORD);
  await page.locator('#btnLogin').click();

  await page.waitForLoadState('networkidle');
  await expect(page.locator('#txtiSignInPassword')).toHaveCount(0);

  await page.locator('#UsefullLinks').getByRole('link', { name: 'Baker Street' }).click();
  await page.waitForURL(/cafe-order-food/);
  await page.waitForLoadState('networkidle');

  // Selecting a location triggers an ASP.NET postback that populates Food Type
  await Promise.all([
    page.waitForLoadState('load'),
    page.locator('#cphContent_CafeFoodOrderUC_ddCafeLocation').selectOption({ label: 'ICC Techno Hub' }),
  ]);
  await page.waitForLoadState('networkidle');

  const foodType = page.locator('#cphContent_CafeFoodOrderUC_ddFoodType');
  await expect(foodType.locator('option', { hasText: FOOD_TYPE })).toHaveCount(1);
  await foodType.selectOption({ label: FOOD_TYPE });
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: `screenshots/baker-street-${FOOD_TYPE.toLowerCase()}.png`, fullPage: true });
});
