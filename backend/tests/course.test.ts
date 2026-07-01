import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { randomUUID } from 'crypto'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser, createCourse } from './helpers'

describe('Course', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('lets an instructor create a course with modules and lessons', async () => {
    const instructor = await registerUser('instructor')

    const res = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({
        title: 'Intro to Testing',
        description: 'Learn to test',
        modules: [
          {
            title: 'Module 1',
            lessons: [{ title: 'Lesson 1', contentUrl: 'https://cdn.test/l1.mp4' }]
          }
        ]
      })

    expect(res.status).toBe(201)
    expect(res.body.data.title).toBe('Intro to Testing')
    expect(res.body.data.modules).toHaveLength(1)
    expect(res.body.data.modules[0].lessons).toHaveLength(1)
  })

  it('rejects course creation with a blank title', async () => {
    const instructor = await registerUser('instructor')

    const res = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ title: '  ', description: null, modules: [] })

    expect(res.status).toBe(400)
  })

  it('blocks a student from creating a course', async () => {
    const student = await registerUser('student')

    const res = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${student.token}`)
      .send({ title: 'Hack Course', description: null, modules: [] })

    expect(res.status).toBe(403)
  })

  it('fetches a course by id publicly', async () => {
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token)

    const res = await request(app).get(`/courses/${courseId}`)

    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(courseId)
  })

  it('returns 404 for a nonexistent course', async () => {
    const res = await request(app).get(`/courses/${randomUUID()}`)
    expect(res.status).toBe(404)
  })

  it('lets the owning instructor update a course', async () => {
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token)

    const res = await request(app)
      .put(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ title: 'Renamed Course', description: 'New desc' })

    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe('Renamed Course')
  })

  it('blocks a non-owning instructor from updating a course', async () => {
    const owner = await registerUser('instructor')
    const other = await registerUser('instructor')
    const courseId = await createCourse(owner.token)

    const res = await request(app)
      .put(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ title: 'Hijacked', description: null })

    expect(res.status).toBe(401)
  })

  it('adds a module and lesson to an existing course', async () => {
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token)

    const moduleRes = await request(app)
      .post(`/courses/${courseId}/modules`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ title: 'New Module' })
    expect(moduleRes.status).toBe(201)
    const moduleId = moduleRes.body.data.id

    const lessonRes = await request(app)
      .post(`/courses/modules/${moduleId}/lessons`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ title: 'New Lesson', contentUrl: 'https://cdn.test/l.mp4' })
    expect(lessonRes.status).toBe(201)
    expect(lessonRes.body.data.title).toBe('New Lesson')
  })

  it('returns instructor analytics for owned courses', async () => {
    const instructor = await registerUser('instructor')
    await createCourse(instructor.token)

    const res = await request(app).get('/courses/analytics').set('Authorization', `Bearer ${instructor.token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})
