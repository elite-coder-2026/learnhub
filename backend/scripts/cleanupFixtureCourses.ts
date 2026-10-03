import 'dotenv/config'
import { pool } from '../config/db'
import * as courseQueries from '../queries/course.query'
import { Course } from '../types/course.type'

const PAGE_SIZE = 100
const FIXTURE_TITLE_PATTERNS: RegExp[] = [/^Repro Course \d+$/, /^E2E Check Course$/]

const findFixtureCourses = async (): Promise<Course[]> => {
  const matches: Course[] = []
  let cursor: string | null = null
  for (;;) {
    const page = await courseQueries.findCoursesPaginated(cursor, PAGE_SIZE)
    matches.push(...page.filter((course) => FIXTURE_TITLE_PATTERNS.some((pattern) => pattern.test(course.title))))
    if (page.length < PAGE_SIZE) return matches
    cursor = page[page.length - 1].id
  }
}

const main = async (): Promise<void> => {
  const isConfirmed = process.argv.includes('--confirm')
  const fixtures = await findFixtureCourses()

  if (fixtures.length === 0) {
    console.log('No fixture courses found.')
    return
  }

  console.log(`Found ${fixtures.length} fixture course(s) to soft delete:`)
  console.table(
    fixtures.map((course) => ({ id: course.id, title: course.title, created_at: course.created_at.toISOString() }))
  )

  if (!isConfirmed) {
    console.log('Dry run. Re-run with --confirm to soft delete these courses.')
    return
  }

  for (const course of fixtures) await courseQueries.softDeleteCourse(course.id)
  console.log(`Soft deleted ${fixtures.length} fixture course(s).`)
}

main()
  .catch((error) => {
    console.error('Fixture cleanup failed', error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
