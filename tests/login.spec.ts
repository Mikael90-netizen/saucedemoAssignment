import { test, expect } from '../src/fixtures/test';
import { users } from '../src/data/testData';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked out user sees an error @regression', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectError('Sorry, this user has been locked out.');
  });

  test('invalid credentials show an error @regression', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('username is required @regression', async ({ loginPage }) => {
    await loginPage.login('', users.standard.password);
    await loginPage.expectError('Username is required');
  });

  test('password is required @regression', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, '');
    await loginPage.expectError('Password is required');
  });

  test('protected page redirects to login when not authenticated @regression', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });

  test('user can log out @smoke', async ({ loggedIn, loginPage, page }) => {
    await loggedIn.logout();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
