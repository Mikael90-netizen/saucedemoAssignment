import { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly name: Locator;
  readonly price: Locator;
  readonly description: Locator;
  readonly addButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    // scope to the details container so stale list-page nodes never match during the SPA transition
    const details = page.getByTestId('inventory-container').locator('.inventory_details');
    this.name = details.getByTestId('inventory-item-name');
    this.price = details.getByTestId('inventory-item-price');
    this.description = details.getByTestId('inventory-item-desc');
    this.addButton = details.getByTestId('add-to-cart');
    this.removeButton = details.getByTestId('remove');
    this.backButton = page.getByTestId('back-to-products');
  }
}
