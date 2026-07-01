import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser, createCourse, enroll } from './helpers'

describe('Review', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('blocks a non-enrolled student from submitting a review', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)

    const res = await request(app)
      .post(`/courses/${courseId}/reviews`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ rating: 5, comment: 'Great course' })

    expect(res.status).toBe(401)
  })

  it('lets an enrolled student submit a review', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    await enroll(student.token, courseId)

    const res = await request(app)
      .post(`/courses/${courseId}/reviews`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ rating: 5, comment: 'Great course' })

    expect(res.status).toBe(201)
    expect(res.body.data.rating).toBe(5)
  })

  it('rejects an out-of-range rating', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    await enroll(student.token, courseId)

    const res = await request(app)
      .post(`/courses/${courseId}/reviews`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ rating: 9, comment: 'too high' })

    expect(res.status).toBe(400)
  })

  it('lists reviews with a rating summary', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    await enroll(student.token, courseId)
    await request(app)
      .post(`/courses/${courseId}/reviews`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ rating: 4, comment: null })

    const res = await request(app).get(`/courses/${courseId}/reviews`)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.summary).toBeDefined()
  })

  it('lets a student delete their own review', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    await enroll(student.token, courseId)
    await request(app)
      .post(`/courses/${courseId}/reviews`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ rating: 3, comment: null })

    const deleteRes = await request(app)
      .delete(`/courses/${courseId}/reviews`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(deleteRes.status).toBe(204)

    const listRes = await request(app).get(`/courses/${courseId}/reviews`)
    expect(listRes.body.data).toHaveLength(0)
  })
})
