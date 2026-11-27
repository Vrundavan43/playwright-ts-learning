import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('https://example.com');
  });

  test('successful login with valid credentials', async ({ page }) => {
    // 2. Fill in username/email and password
    // Best practice: use environment variables instead of hardcoding secrets
    await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL || 'user@example.com');
    await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD || 'SuperSecretPassword!');

    // 3. Click the submit button
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    // 4. Assert successful login (check URL redirect and visible dashboard element)
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });

  test('shows error message on invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('WrongPassword123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    // Assert error message appears and URL hasn't changed
    await expect(page.getByRole('alert')).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/.*login/);
  });
});
