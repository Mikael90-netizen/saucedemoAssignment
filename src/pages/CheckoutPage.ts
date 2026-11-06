import { Locator, Page, expect } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.error = page.getByTestId('error');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillInfo(info: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  private static amount(text: string | null): number {
    const match = text?.match(/\$([\d.]+)/);
    return match ? Number(match[1]) : NaN;
  }

  async getSummary() {
    await expect(this.total).toBeVisible();
    const prices = (await this.itemPrices.allTextContents()).map((t) => CheckoutPage.amount(t));
    return {
      itemsSum: prices.reduce((a, b) => a + b, 0),
      subtotal: CheckoutPage.amount(await this.subtotal.textContent()),
      tax: CheckoutPage.amount(await this.tax.textContent()),
      total: CheckoutPage.amount(await this.total.textContent()),
    };
  }

  async finish() {
    await this.finishButton.click();
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
