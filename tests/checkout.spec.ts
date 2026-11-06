import { test, expect } from '../src/fixtures/test';
import { checkoutInfo, products } from '../src/data/testData';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(products.backpack);
    await loggedIn.addToCart(products.bikeLight);
    await loggedIn.openCart();
    await cartPage.checkout();
  });

  test('complete end-to-end purchase @smoke', async ({ checkoutPage, inventoryPage, page }) => {
    await checkoutPage.fillInfo(checkoutInfo);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    const summary = await checkoutPage.getSummary();
    expect(summary.subtotal).toBeCloseTo(summary.itemsSum, 2);
    expect(summary.total).toBeCloseTo(summary.subtotal + summary.tax, 2);

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await inventoryPage.expectCartCount(0);

    await checkoutPage.backHomeButton.click();
    await inventoryPage.expectLoaded();
  });

  const requiredFields = [
    { field: 'First Name', info: { ...checkoutInfo, firstName: '' } },
    { field: 'Last Name', info: { ...checkoutInfo, lastName: '' } },
    { field: 'Postal Code', info: { ...checkoutInfo, postalCode: '' } },
  ];

  for (const { field, info } of requiredFields) {
    test(`${field} is required @regression`, async ({ checkoutPage }) => {
      await checkoutPage.fillInfo(info);
      await expect(checkoutPage.error).toHaveText(`Error: ${field} is required`);
    });
  }

  test('cancel on information step returns to cart @regression', async ({ checkoutPage, cartPage }) => {
    await checkoutPage.cancelButton.click();
    await cartPage.expectLoaded();
    await expect(cartPage.items).toHaveCount(2);
  });
});
