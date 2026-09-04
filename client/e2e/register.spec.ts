import { test, expect, type Page } from '@playwright/test'

const fillValidForm = async (page: Page): Promise<void> => {
  await page.getByLabel('First name').fill('Ada')
  await page.getByLabel('Last name').fill('Lovelace')
  await page.getByLabel('Email').fill('ada@example.com')
  await page.getByLabel('Password', { exact: true }).fill('password123')
  await page.getByLabel('Confirm password').fill('password123')
}

test.describe('Register page', () => {
  test('registers successfully and shows the success message', async ({ page }) => {
    await page.route('**/auth/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ data: { token: 'jwt-token', userId: 'user-1' } }),
      })
    })

    await page.goto('/register')
    await fillValidForm(page)
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByRole('status')).toHaveText('Account created. You can now sign in.')
  })

  test('shows inline validation errors without calling the network', async ({ page }) => {
    let requestCount = 0
    await page.route('**/auth/register', (route) => {
      requestCount += 1
      return route.continue()
    })

    await page.goto('/register')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Enter your first name')).toBeVisible()
    await expect(page.getByText('Enter a valid email address')).toBeVisible()
    expect(requestCount).toBe(0)
  })

  test('shows the backend error message on a failed registration', async ({ page }) => {
    await page.route('**/auth/register', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email already registered' }),
      })
    })

    await page.goto('/register')
    await fillValidForm(page)
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByRole('alert')).toHaveText('Email already registered')
  })

  test('lets a user select the instructor role before submitting', async ({ page }) => {
    let capturedBody: Record<string, unknown> = {}
    await page.route('**/auth/register', async (route) => {
      capturedBody = JSON.parse(route.request().postData() ?? '{}')
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ data: { token: 'jwt-token', userId: 'user-1' } }),
      })
    })

    await page.goto('/register')
    await fillValidForm(page)
    await page.getByRole('button', { name: 'Student' }).click()
    await page.getByRole('option', { name: 'Instructor' }).click()
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByRole('status')).toBeVisible()
    expect(capturedBody.userRole).toBe('instructor')
  })
})
