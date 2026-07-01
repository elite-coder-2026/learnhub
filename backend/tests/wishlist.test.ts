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

const createCourse = async (instructorToken: string): Promise<string> => {
  const res = await request(app)
    .post('/courses')
    .set('Authorization', `Bearer ${instructorToken}`)
    .send({ title: `Course ${randomUUID()}`, description: 'A test course', modules: [] })
  return res.body.data.id
}

describe('Wishlist', () => {
  let studentToken: string
  let courseId: string

  beforeAll(async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    studentToken = student.token
    courseId = await createCourse(instructor.token)
  })

  afterAll(async () => {
    await pool.end()
  })

  it('adds a course to the wishlist', async () => {
    const res = await request(app)
      .post(`/wishlist/${courseId}`)
      .set('Authorization', `Bearer ${studentToken}`)

    expect(res.status).toBe(201)
    expect(res.body.data.course_id).toBe(courseId)
  })

  it('lists the wishlist with the added course', async () => {
    const res = await request(app).get('/wishlist').set('Authorization', `Bearer ${studentToken}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].course_id).toBe(courseId)
  })

  it('rejects adding the same course twice', async () => {
    const res = await request(app)
      .post(`/wishlist/${courseId}`)
      .set('Authorization', `Bearer ${studentToken}`)

    expect(res.status).toBe(400)
  })

  it('rejects wishlisting a course that does not exist', async () => {
    const res = await request(app)
      .post(`/wishlist/${randomUUID()}`)
      .set('Authorization', `Bearer ${studentToken}`)

    expect(res.status).toBe(404)
  })

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/wishlist')
    expect(res.status).toBe(401)
  })

  it('removes a course from the wishlist', async () => {
    const removeRes = await request(app)
      .delete(`/wishlist/${courseId}`)
      .set('Authorization', `Bearer ${studentToken}`)
    expect(removeRes.status).toBe(204)

    const listRes = await request(app).get('/wishlist').set('Authorization', `Bearer ${studentToken}`)
    expect(listRes.body.data).toHaveLength(0)
  })

  it('rejects removing a course that is not in the wishlist', async () => {
    const res = await request(app)
      .delete(`/wishlist/${courseId}`)
      .set('Authorization', `Bearer ${studentToken}`)

    expect(res.status).toBe(404)
  })
})
