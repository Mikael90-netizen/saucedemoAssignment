import { test, expect } from '../src/fixtures/test';
import { products } from '../src/data/testData';

test.describe('Inventory', () => {
  test('sort by name A to Z @regression', async ({ loggedIn }) => {
    await loggedIn.sortBy('az');
    const names = await loggedIn.getNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sort by name Z to A @regression', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.getNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sort by price low to high @smoke', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low @regression', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('product details page shows matching data @regression', async ({ loggedIn, productPage, page }) => {
    const listPrice = await loggedIn.item(products.backpack).getByTestId('inventory-item-price').textContent();
    await loggedIn.openProduct(products.backpack);

    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
    await expect(productPage.name).toHaveText(products.backpack);
    await expect(productPage.price).toHaveText(listPrice!);
    await expect(productPage.description).not.toBeEmpty();

    await productPage.addButton.click();
    await expect(productPage.removeButton).toBeVisible();
    await loggedIn.expectCartCount(1);

    await productPage.backButton.click();
    await loggedIn.expectLoaded();
  });
});
