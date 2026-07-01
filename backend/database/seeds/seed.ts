import 'dotenv/config'
import { pool } from '../../config/db'
import * as authService from '../../services/auth.service'
import * as courseService from '../../services/course.service'
import * as enrollmentService from '../../services/enrollment.service'

const seed = async (): Promise<void> => {
  const _admin = await authService.register({
    email: 'admin@learnhub.dev',
    password: 'password123',
    firstName: 'Ada',
    lastName: 'Admin',
    userRole: 'admin'
  })

  const instructor = await authService.register({
    email: 'instructor@learnhub.dev',
    password: 'password123',
    firstName: 'Ivy',
    lastName: 'Instructor',
    userRole: 'instructor'
  })

  const student = await authService.register({
    email: 'student@learnhub.dev',
    password: 'password123',
    firstName: 'Sam',
    lastName: 'Student',
    userRole: 'student'
  })

  const course = await courseService.createCourse(instructor.userId, {
    title: 'Introduction to LearnHub',
    description: 'A seeded course for local development',
    modules: [
      {
        title: 'Getting Started',
        lessons: [
          { title: 'Welcome', contentUrl: 'https://cdn.example.com/seed/welcome.mp4' },
          { title: 'Setting Up', contentUrl: 'https://cdn.example.com/seed/setup.mp4' }
        ]
      }
    ]
  })

  await enrollmentService.enrollInCourse(student.userId, course.id)

  console.log('Seed complete:')
  console.log(`  admin:      admin@learnhub.dev / password123`)
  console.log(`  instructor: instructor@learnhub.dev / password123`)
  console.log(`  student:    student@learnhub.dev / password123`)
  console.log(`  course:     ${course.id}`)
}

seed()
  .catch((error) => {
    console.error('Seed failed', error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
