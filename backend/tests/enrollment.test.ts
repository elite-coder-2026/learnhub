import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser, createCourse, enroll } from './helpers'

describe('Enrollment', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('browses courses without auth', async () => {
    const instructor = await registerUser('instructor')
    await createCourse(instructor.token)

    const res = await request(app).get('/courses')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('enrolls a student in a course', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)

    const res = await request(app)
      .post(`/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(201)
    expect(res.body.data.course_id).toBe(courseId)
  })

  it('rejects enrolling in the same course twice', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)

    await enroll(student.token, courseId)
    const res = await request(app)
      .post(`/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(400)
  })

  it('blocks an instructor from enrolling as a student', async () => {
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token)

    const res = await request(app)
      .post(`/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${instructor.token}`)

    expect(res.status).toBe(403)
  })

  it('lets the owning instructor list enrolled students', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    await enroll(student.token, courseId)

    const res = await request(app)
      .get(`/courses/${courseId}/students`)
      .set('Authorization', `Bearer ${instructor.token}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].student_id).toBe(student.userId)
  })

  it('blocks a non-owning instructor from listing enrolled students', async () => {
    const owner = await registerUser('instructor')
    const other = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(owner.token)
    await enroll(student.token, courseId)

    const res = await request(app)
      .get(`/courses/${courseId}/students`)
      .set('Authorization', `Bearer ${other.token}`)

    expect(res.status).toBe(401)
  })
})
