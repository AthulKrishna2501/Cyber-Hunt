import { test, expect } from '@playwright/test';

test('has title and can navigate to login', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Cyber Hunt/i);

    // Check if main heading is present
    await expect(page.locator('h1').filter({ hasText: 'Cyber Hunt' })).toBeVisible();

    // Click the Login link
    await page.getByRole('link', { name: 'Login' }).first().click();

    // Expect the URL to contain login
    await expect(page).toHaveURL(/.*login/);

    // Expect login form to be visible (testing basic auth routing edge case)
    await expect(page.getByRole('heading', { name: 'Terminal Login' })).toBeVisible();
});

test('can navigate to register from homepage', async ({ page }) => {
    await page.goto('/');

    // Click the Register link
    await page.getByRole('link', { name: 'Initialize Hunt' }).click();

    // Expect the URL to contain register
    await expect(page).toHaveURL(/.*register/);

    // Check that we see the 'Professional Enrollment' form heading
    await expect(page.getByRole('heading', { name: 'Professional Enrollment' })).toBeVisible();
});
