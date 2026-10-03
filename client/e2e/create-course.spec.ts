import { test, expect } from './fixtures'

const COURSE_ID_PATTERN = /\/courses\/([0-9a-f-]{36})$/

test.describe('Create course', () => {
  test('instructor builds a course with modules and lessons', async ({ page, loginAs, trackCourse }) => {
    await loginAs(page, 'instructor')
    await page.getByRole('link', { name: 'Create Course' }).click()
    await expect(page.getByText('Course details')).toBeVisible()

    await page.getByLabel('Title', { exact: true }).fill(`E2E Course ${Date.now()}`)
    await page.getByLabel('Description').fill('Created by the create-course e2e spec')

    const firstModule = page.getByRole('region', { name: 'Module 1' })
    await firstModule.getByLabel('Module title').fill('Getting Started')
    await firstModule.getByLabel('Lesson title').fill('Welcome')
    await firstModule.getByRole('button', { name: 'Add lesson' }).click()
    await firstModule.getByLabel('Lesson title').nth(1).fill('Setup')

    await page.getByRole('button', { name: 'Add module' }).click()
    const secondModule = page.getByRole('region', { name: 'Module 2' })
    await secondModule.getByLabel('Module title').fill('Core Concepts')
    await secondModule.getByLabel('Lesson title').fill('Types')
    await expect(page.getByText('2 modules · 3 lessons')).toBeVisible()

    await page.getByRole('button', { name: 'Create course' }).click()
    await page.waitForURL(COURSE_ID_PATTERN)
    const courseId = COURSE_ID_PATTERN.exec(page.url())?.[1]
    expect(courseId).toBeDefined()
    if (courseId) trackCourse(courseId)

    const curriculum = page.getByLabel('Course lessons')
    for (const text of ['Getting Started', 'Welcome', 'Setup', 'Core Concepts', 'Types']) {
      await expect(curriculum.getByText(text, { exact: true })).toBeVisible()
    }
  })

  test('students cannot see or open the create course form', async ({ page, loginAs }) => {
    await loginAs(page, 'student')
    await expect(page.getByRole('link', { name: 'Create Course' })).toHaveCount(0)
    await page.goto('/courses/new')
    await expect(page.getByText('Course details')).toHaveCount(0)
  })
})
