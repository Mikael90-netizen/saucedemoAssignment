import { test, expect } from '../src/fixtures/test';
import { products } from '../src/data/testData';

test.describe('Cart', () => {
  test('add and remove items updates the badge @smoke', async ({ loggedIn }) => {
    await loggedIn.addToCart(products.backpack);
    await loggedIn.addToCart(products.bikeLight);
    await loggedIn.expectCartCount(2);

    await loggedIn.removeFromCart(products.backpack);
    await loggedIn.expectCartCount(1);

    await loggedIn.removeFromCart(products.bikeLight);
    await loggedIn.expectCartCount(0);
  });

  test('cart lists the added items @regression', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(products.boltTShirt);
    await loggedIn.addToCart(products.onesie);
    await loggedIn.openCart();

    await cartPage.expectLoaded();
    await expect(cartPage.itemNames).toHaveText([products.boltTShirt, products.onesie]);
  });

  test('remove item from the cart page @regression', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(products.fleeceJacket);
    await loggedIn.openCart();
    await cartPage.remove(products.fleeceJacket);

    await expect(cartPage.items).toHaveCount(0);
    await loggedIn.expectCartCount(0);
  });

  test('cart persists across page reload @regression', async ({ loggedIn, page }) => {
    await loggedIn.addToCart(products.backpack);
    await page.reload();
    await loggedIn.expectCartCount(1);
  });

  test('continue shopping returns to inventory @regression', async ({ loggedIn, cartPage }) => {
    await loggedIn.openCart();
    await cartPage.continueShoppingButton.click();
    await loggedIn.expectLoaded();
  });
});
