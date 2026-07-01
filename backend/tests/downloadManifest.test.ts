import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { randomUUID } from 'crypto'
import { app } from '../app'
import { pool } from '../config/db'

const registerUser = async (role: 'student' | 'instructor'): Promise<{ token: string; userId: string }> => {
  const email = `${role}-${randomUUID()}@test.com`
  const res = await request(app).post('/auth/register').send({
    email,
    password: 'password123',
    firstName: 'Test',
    lastName: role,
    userRole: role
  })
  return { token: res.body.data.token, userId: res.body.data.userId }
}

describe('Course download manifest', () => {
  let studentToken: string
  let instructorToken: string
  let courseId: string

  beforeAll(async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    instructorToken = instructor.token
    studentToken = student.token

    const courseRes = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        title: `Course ${randomUUID()}`,
        description: 'A downloadable course',
        modules: [
          {
            title: 'Module 1',
            lessons: [
              { title: 'Lesson 1', contentUrl: 'https://cdn.test/lesson1.mp4' },
              { title: 'Lesson 2', contentUrl: 'https://cdn.test/lesson2.mp4' }
            ]
          }
        ]
      })
    courseId = courseRes.body.data.id
  })

  afterAll(async () => {
    await pool.end()
  })

  it('rejects a non-enrolled student', async () => {
    const res = await request(app)
      .get(`/courses/${courseId}/download-manifest`)
      .set('Authorization', `Bearer ${studentToken}`)

    expect(res.status).toBe(401)
  })

  it('returns the lesson manifest for an enrolled student', async () => {
    const enrollRes = await request(app)
      .post(`/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${studentToken}`)
    expect(enrollRes.status).toBe(201)

    const manifestRes = await request(app)
      .get(`/courses/${courseId}/download-manifest`)
      .set('Authorization', `Bearer ${studentToken}`)

    expect(manifestRes.status).toBe(200)
    expect(manifestRes.body.data).toHaveLength(2)
    expect(manifestRes.body.data[0]).toMatchObject({
      title: 'Lesson 1',
      content_url: 'https://cdn.test/lesson1.mp4'
    })
    expect(manifestRes.body.data[1]).toMatchObject({
      title: 'Lesson 2',
      content_url: 'https://cdn.test/lesson2.mp4'
    })
  })

  it('rejects requests with no auth token', async () => {
    const res = await request(app).get(`/courses/${courseId}/download-manifest`)
    expect(res.status).toBe(401)
  })

  it('returns 404 for a nonexistent course', async () => {
    const res = await request(app)
      .get(`/courses/${randomUUID()}/download-manifest`)
      .set('Authorization', `Bearer ${studentToken}`)

    expect(res.status).toBe(404)
  })
})
