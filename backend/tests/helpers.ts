import request from 'supertest'
import { randomUUID } from 'crypto'
import { app } from '../app'

export interface TestUser {
  token: string
  userId: string
  email: string
}

export const registerUser = async (role: 'student' | 'instructor' | 'admin'): Promise<TestUser> => {
  const email = `${role}-${randomUUID()}@test.com`
  const res = await request(app).post('/auth/register').send({
    email,
    password: 'password123',
    firstName: 'Test',
    lastName: role,
    userRole: role
  })
  return { token: res.body.data.token, userId: res.body.data.userId, email }
}

interface LessonInput {
  title: string
  contentUrl: string | null
}

interface ModuleInput {
  title: string
  lessons: LessonInput[]
}

export const createCourse = async (
  instructorToken: string,
  overrides: Partial<{ title: string; description: string; modules: ModuleInput[] }> = {}
): Promise<string> => {
  const res = await request(app)
    .post('/courses')
    .set('Authorization', `Bearer ${instructorToken}`)
    .send({
      title: overrides.title ?? `Course ${randomUUID()}`,
      description: overrides.description ?? 'A test course',
      modules: overrides.modules ?? []
    })
  return res.body.data.id
}

export const enroll = async (studentToken: string, courseId: string): Promise<void> => {
  const res = await request(app).post(`/courses/${courseId}/enroll`).set('Authorization', `Bearer ${studentToken}`)
  if (res.status !== 201) throw new Error(`enroll failed: ${res.status} ${JSON.stringify(res.body)}`)
}
