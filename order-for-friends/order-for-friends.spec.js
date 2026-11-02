const { test, expect } = require('@playwright/test');

const { BRAINX_EMAIL, BRAINX_PASSWORD, LOCATION = 'ICC Techno Hub' } = process.env;

// Parses "[Name One, Name Two]" (quotes optional) into ['Name One', 'Name Two']
const parseList = (value = '') =>
  value
    .replace(/^\s*\[|\]\s*$/g, '')
    .split(',')
    .map((name) => name.trim().replace(/^["']|["']$/g, '').trim())
    .filter(Boolean);

const chickenFriends = parseList(process.env.CHICKEN_FRIENDS);
const fishFriends = parseList(process.env.FISH_FRIENDS);
const orders = [
  ...chickenFriends.map((name) => ({ name, food: 'Chicken' })),
  ...fishFriends.map((name) => ({ name, food: 'Fish' })),
];

test('order food for friends', async ({ page }) => {
  test.skip(!BRAINX_EMAIL || !BRAINX_PASSWORD, 'Set BRAINX_EMAIL and BRAINX_PASSWORD in .env');
  test.skip(orders.length === 0, 'CHICKEN_FRIENDS and FISH_FRIENDS are both empty');
  test.setTimeout(60_000 * (orders.length + 1));

  // ASP.NET UpdatePanel re-renders the DOM after the response, so wait for the async postback to finish
  const postbackDone = () =>
    page.waitForFunction(() => !window.Sys || !Sys.WebForms.PageRequestManager.getInstance().get_isInAsyncPostBack());

  const isPostback = (r) => r.url().includes('cafe-order-food') && r.request().method() === 'POST';

  await page.goto('/login');
  await page.locator('#txtiSignInEmail').fill(BRAINX_EMAIL);
  await page.locator('#txtiSignInPassword').fill(BRAINX_PASSWORD);
  await page.locator('#btnLogin').click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#txtiSignInPassword')).toHaveCount(0);

  await page.locator('#UsefullLinks').getByRole('link', { name: 'Baker Street' }).click();
  await page.waitForURL(/cafe-order-food/);
  await page.waitForLoadState('networkidle');
  const orderPageUrl = page.url();

  for (const [index, { name, food }] of orders.entries()) {
    // Start every order from a fresh form
    if (index > 0) {
      await page.goto(orderPageUrl);
      await page.waitForLoadState('networkidle');
    }

    await Promise.all([
      page.waitForResponse(isPostback),
      page.locator('#cphContent_CafeFoodOrderUC_ddCafeLocation').selectOption({ label: LOCATION }),
    ]);
    await page.waitForLoadState('networkidle');

    await Promise.all([
      page.waitForResponse(isPostback),
      page.locator('#cphContent_CafeFoodOrderUC_ddOrderFor').selectOption({ label: 'For a Colleague' }),
    ]);
    await page.waitForLoadState('networkidle');
    await postbackDone();

    const colleague = page.locator('#cphContent_CafeFoodOrderUC_ddColleague');
    await expect(colleague.locator('option', { hasText: name }), `Colleague "${name}" not found`).toHaveCount(1);
    await colleague.selectOption({ label: name });

    const foodType = page.locator('#cphContent_CafeFoodOrderUC_ddFoodType');
    await expect(foodType.locator('option', { hasText: food })).toHaveCount(1);
    await Promise.all([
      page.waitForResponse(isPostback),
      foodType.selectOption({ label: food }),
    ]);
    await page.waitForLoadState('networkidle');
    await postbackDone();
    await expect(colleague).toHaveValue(/[1-9]/); // colleague survived the food type postback

    const submit = page.locator('#cphContent_CafeFoodOrderUC_btnSave');
    await Promise.all([
      page.waitForResponse(isPostback),
      submit.click(),
    ]);
    await page.waitForLoadState('networkidle');
    await postbackDone();
  }

  await page.screenshot({ path: 'screenshots/baker-street-friends.png', fullPage: true });
});
