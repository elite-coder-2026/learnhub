import 'dotenv/config'
import { pool } from '../../config/db'
import * as authQueries from '../../queries/auth.query'
import * as courseQueries from '../../queries/course.query'
import * as authService from '../../services/auth.service'
import * as courseService from '../../services/course.service'
import * as enrollmentService from '../../services/enrollment.service'
import { CourseLevel } from '../../types/course.type'
import { ValidationError } from '../../utils/errors'

interface SeedUser {
  email: string
  firstName: string
  lastName: string
  userRole: 'student' | 'instructor' | 'admin'
}

interface SeedModule {
  title: string
  lessons: string[]
}

interface SeedCourse {
  title: string
  description: string
  category: string
  level: CourseLevel
  priceCents: number
  instructorEmail: string
  modules: SeedModule[]
}

const SEED_PASSWORD = 'password123'
const PAGE_SIZE = 100

const USERS: SeedUser[] = [
  { email: 'admin@learnhub.dev', firstName: 'Ada', lastName: 'Admin', userRole: 'admin' },
  { email: 'instructor@learnhub.dev', firstName: 'Ivy', lastName: 'Instructor', userRole: 'instructor' },
  { email: 'student@learnhub.dev', firstName: 'Sam', lastName: 'Student', userRole: 'student' }
]

const COURSES: SeedCourse[] = [
  {
    title: 'TypeScript Fundamentals',
    description:
      'Learn the type system that makes large JavaScript codebases manageable: primitives, unions, generics, and strict-mode habits that catch bugs before they ship.',
    category: 'Programming',
    level: 'beginner',
    priceCents: 4999,
    instructorEmail: 'instructor@learnhub.dev',
    modules: [
      { title: 'Getting Started', lessons: ['Why TypeScript', 'Installing the Compiler', 'Your First Typed Program'] },
      { title: 'The Type System', lessons: ['Primitives and Literals', 'Unions and Narrowing', 'Interfaces vs Type Aliases'] },
      { title: 'Generics', lessons: ['Generic Functions', 'Generic Constraints', 'Utility Types in Practice'] }
    ]
  },
  {
    title: 'React Patterns in Practice',
    description:
      'Go beyond the basics with composition, custom hooks, server state with React Query, and performance techniques used in production React apps.',
    category: 'Frontend',
    level: 'intermediate',
    priceCents: 7999,
    instructorEmail: 'instructor@learnhub.dev',
    modules: [
      { title: 'Component Composition', lessons: ['Children and Slots', 'Compound Components', 'Render Props Today'] },
      { title: 'Custom Hooks', lessons: ['Extracting Logic into Hooks', 'Hook Return Contracts', 'Testing Hooks'] },
      { title: 'Server State', lessons: ['Queries and Caching', 'Mutations and Invalidation', 'Infinite Lists'] },
      { title: 'Performance', lessons: ['Measuring Renders', 'Memoization That Matters', 'Code Splitting Routes'] }
    ]
  },
  {
    title: 'PostgreSQL for Application Developers',
    description:
      'Write SQL you can trust: schema design, indexes, transactions, and query plans, taught from the perspective of the app code that runs them.',
    category: 'Databases',
    level: 'intermediate',
    priceCents: 6999,
    instructorEmail: 'instructor@learnhub.dev',
    modules: [
      { title: 'Modeling Data', lessons: ['Tables, Keys, and UUIDs', 'Constraints as Documentation', 'Soft Deletes', 'Enums and Lookup Tables'] },
      { title: 'Querying Well', lessons: ['Joins Without Fear', 'Window Functions', 'Cursor Pagination'] },
      { title: 'Performance and Safety', lessons: ['Reading EXPLAIN', 'Choosing Indexes', 'Transactions and Isolation'] }
    ]
  },
  {
    title: 'Designing REST APIs',
    description:
      'Design APIs that clients enjoy using: resource modeling, status codes, error shapes, pagination, and versioning without breaking consumers.',
    category: 'Backend',
    level: 'intermediate',
    priceCents: 5999,
    instructorEmail: 'instructor@learnhub.dev',
    modules: [
      { title: 'Resources and Routes', lessons: ['Modeling Resources', 'HTTP Methods and Idempotency', 'Status Codes That Help'] },
      { title: 'Contracts', lessons: ['Consistent Error Responses', 'Pagination Strategies', 'Filtering and Sorting'] },
      { title: 'Evolving an API', lessons: ['Versioning Approaches', 'Deprecating Safely'] }
    ]
  },
  {
    title: 'Intro to Data Visualization',
    description:
      'Turn numbers into charts people understand. Pick the right chart, use color with intent, and avoid the classic mistakes that mislead readers.',
    category: 'Data',
    level: 'beginner',
    priceCents: 0,
    instructorEmail: 'instructor@learnhub.dev',
    modules: [
      { title: 'Choosing a Chart', lessons: ['Comparisons and Rankings', 'Trends Over Time', 'Parts of a Whole'] },
      { title: 'Design Choices', lessons: ['Color with Intent', 'Labels and Annotations', 'Common Misleading Charts'] }
    ]
  },
  {
    title: 'System Design Essentials',
    description:
      'Reason about scale: caching, queues, replication, and consistency trade-offs, practiced through real design exercises from small apps to large platforms.',
    category: 'Architecture',
    level: 'advanced',
    priceCents: 12999,
    instructorEmail: 'instructor@learnhub.dev',
    modules: [
      { title: 'Foundations', lessons: ['Latency and Throughput', 'Back-of-the-Envelope Estimates', 'Load Balancing'] },
      { title: 'Data at Scale', lessons: ['Caching Layers', 'Replication', 'Sharding Strategies'] },
      { title: 'Asynchronous Systems', lessons: ['Message Queues', 'Idempotent Consumers', 'Event-Driven Design'] },
      { title: 'Case Studies', lessons: ['Designing a URL Shortener', 'Designing a News Feed'] }
    ]
  },
  {
    title: 'Accessible Web Interfaces',
    description:
      'Build interfaces everyone can use. Semantic HTML, keyboard support, ARIA used correctly, and testing with real assistive technology.',
    category: 'Frontend',
    level: 'beginner',
    priceCents: 3999,
    instructorEmail: 'instructor@learnhub.dev',
    modules: [
      { title: 'Foundations', lessons: ['Who Accessibility Serves', 'Semantic HTML First', 'Color and Contrast'] },
      { title: 'Interaction', lessons: ['Keyboard Navigation', 'Focus Management'] },
      { title: 'Testing', lessons: ['Screen Reader Basics', 'Automated Audits and Their Limits'] }
    ]
  }
]

const STUDENT_ENROLLMENTS = ['TypeScript Fundamentals', 'React Patterns in Practice']

const toSlug = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const findOrCreateUser = async (user: SeedUser): Promise<string> => {
  const existing = await authQueries.findUserByEmail(user.email)
  if (existing) return existing.id
  const created = await authService.register({ ...user, password: SEED_PASSWORD })
  console.log(`  created user ${user.email}`)
  return created.userId
}

const loadExistingCourseIdsByTitle = async (): Promise<Map<string, string>> => {
  const idsByTitle = new Map<string, string>()
  let cursor: string | null = null
  for (;;) {
    const page = await courseQueries.findCoursesPaginated(cursor, PAGE_SIZE)
    for (const course of page) idsByTitle.set(course.title, course.id)
    if (page.length < PAGE_SIZE) return idsByTitle
    cursor = page[page.length - 1].id
  }
}

const seed = async (): Promise<void> => {
  const userIds = new Map<string, string>()
  for (const user of USERS) userIds.set(user.email, await findOrCreateUser(user))

  const courseIds = await loadExistingCourseIdsByTitle()
  for (const course of COURSES) {
    const existingId = courseIds.get(course.title)
    if (existingId) {
      await courseQueries.setCourseCatalogFields(existingId, course.category, course.level, course.priceCents)
      console.log(`  updated catalog fields for existing course "${course.title}"`)
      continue
    }
    const instructorId = userIds.get(course.instructorEmail)
    if (!instructorId) throw new Error(`Seed instructor ${course.instructorEmail} is missing`)

    const created = await courseService.createCourse(instructorId, {
      title: course.title,
      description: course.description,
      modules: course.modules.map((courseModule) => ({
        title: courseModule.title,
        lessons: courseModule.lessons.map((lessonTitle) => ({
          title: lessonTitle,
          contentUrl: `https://cdn.example.com/seed/${toSlug(course.title)}/${toSlug(lessonTitle)}.mp4`
        }))
      }))
    })
    await courseQueries.setCourseCatalogFields(created.id, course.category, course.level, course.priceCents)
    courseIds.set(course.title, created.id)
    console.log(`  created course "${course.title}"`)
  }

  const studentId = userIds.get('student@learnhub.dev')
  if (!studentId) throw new Error('Seed student is missing')
  for (const title of STUDENT_ENROLLMENTS) {
    const courseId = courseIds.get(title)
    if (!courseId) throw new Error(`Seed course "${title}" is missing`)
    try {
      await enrollmentService.enrollInCourse(studentId, courseId)
      console.log(`  enrolled student in "${title}"`)
    } catch (error) {
      if (!(error instanceof ValidationError)) throw error
      console.log(`  student already enrolled in "${title}"`)
    }
  }

  console.log('Seed complete. All seed accounts use password123:')
  for (const user of USERS) console.log(`  ${user.userRole.padEnd(10)} ${user.email}`)
}

seed()
  .catch((error) => {
    console.error('Seed failed', error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
