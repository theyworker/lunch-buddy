const { test, expect } = require('@playwright/test');

const { BRAINX_EMAIL, BRAINX_PASSWORD, FOOD_TYPE = 'Chicken', LOCATION = 'ICC Techno Hub' } = process.env;
const FOOD_TYPES = ['Chicken', 'Fish', 'Vegetable'];

test('order food for you', async ({ page }) => {
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

  const isPostback = (r) => r.url().includes('cafe-order-food') && r.request().method() === 'POST';

  // Each dropdown change triggers an ASP.NET postback (fired via setTimeout), so wait for its response
  await Promise.all([
    page.waitForResponse(isPostback),
    page.locator('#cphContent_CafeFoodOrderUC_ddCafeLocation').selectOption({ label: LOCATION }),
  ]);
  await page.waitForLoadState('networkidle');

  const foodType = page.locator('#cphContent_CafeFoodOrderUC_ddFoodType');
  await expect(foodType.locator('option', { hasText: FOOD_TYPE })).toHaveCount(1);
  await Promise.all([
    page.waitForResponse(isPostback),
    foodType.selectOption({ label: FOOD_TYPE }),
  ]);
  await page.waitForLoadState('networkidle');
  await expect(foodType).toHaveValue(/[1-9]/); // selection survived the re-render

  // Submit the order and wait for its postback to complete
  const submit = page.locator('#cphContent_CafeFoodOrderUC_btnSave');
  await submit.scrollIntoViewIfNeeded();
  await Promise.all([
    page.waitForResponse(isPostback),
    submit.click(),
  ]);
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: `screenshots/baker-street-${FOOD_TYPE.toLowerCase()}.png`, fullPage: true });
});
