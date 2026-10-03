import { test as base, expect, type APIRequestContext, type Page } from '@playwright/test'

export type E2eRole = 'student' | 'instructor' | 'admin'

export interface E2eUser {
  email: string
  password: string
  token: string
}

interface AuthResponse {
  data: { token: string; userId: string }
}

interface E2eFixtures {
  userFor: (role: E2eRole) => Promise<E2eUser>
  loginAs: (page: Page, role: E2eRole) => Promise<E2eUser>
  trackCourse: (courseId: string) => void
}

const E2E_PASSWORD = 'e2e-password-123'

const getApiUrl = (): string => {
  const apiUrl = process.env.E2E_API_URL
  if (!apiUrl) throw new Error('E2E_API_URL is not set; run through playwright.config.ts')
  return apiUrl
}

const ensureUser = async (request: APIRequestContext, apiUrl: string, role: E2eRole): Promise<E2eUser> => {
  const email = `e2e-${role}@learnhub.test`
  const loginResponse = await request.post(`${apiUrl}/auth/login`, { data: { email, password: E2E_PASSWORD } })
  if (loginResponse.ok()) {
    const body = (await loginResponse.json()) as AuthResponse
    return { email, password: E2E_PASSWORD, token: body.data.token }
  }

  const registerResponse = await request.post(`${apiUrl}/auth/register`, {
    data: { email, password: E2E_PASSWORD, firstName: 'E2E', lastName: role, userRole: role },
  })
  expect(registerResponse.ok(), `register ${email}: ${await registerResponse.text()}`).toBeTruthy()
  const body = (await registerResponse.json()) as AuthResponse
  return { email, password: E2E_PASSWORD, token: body.data.token }
}

export const test = base.extend<E2eFixtures>({
  userFor: async ({ request }, provide) => {
    await provide(async (role) => ensureUser(request, getApiUrl(), role))
  },

  loginAs: async ({ userFor }, provide) => {
    await provide(async (page, role) => {
      const user = await userFor(role)
      await page.goto('/login')
      await page.getByLabel(/email/i).fill(user.email)
      await page.getByLabel(/password/i).first().fill(user.password)
      await page.getByRole('button', { name: /log in|sign in/i }).click()
      await page.waitForURL('**/dashboard')
      return user
    })
  },

  trackCourse: [
    async ({ request, userFor }, provide) => {
      const createdCourseIds: string[] = []
      await provide((courseId) => {
        createdCourseIds.push(courseId)
      })

      if (createdCourseIds.length === 0) return
      const admin = await userFor('admin')
      for (const courseId of createdCourseIds) {
        const response = await request.delete(`${getApiUrl()}/admin/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        })
        expect(response.status(), `teardown of course ${courseId}`).toBe(204)
      }
    },
    { auto: true },
  ],
})

export { expect }
