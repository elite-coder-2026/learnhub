import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser, createCourse, enroll } from './helpers'
import * as fraudQueries from '../queries/fraud.query'
import * as enrollmentQueries from '../queries/enrollment.query'

describe('Admin', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('blocks a non-admin from listing users', async () => {
    const student = await registerUser('student')

    const res = await request(app).get('/admin/users').set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(403)
  })

  it('lets an admin list users, courses, and platform analytics', async () => {
    const admin = await registerUser('admin')
    const instructor = await registerUser('instructor')
    await createCourse(instructor.token)

    const usersRes = await request(app).get('/admin/users').set('Authorization', `Bearer ${admin.token}`)
    expect(usersRes.status).toBe(200)
    expect(usersRes.body.data.length).toBeGreaterThan(0)

    const coursesRes = await request(app).get('/admin/courses').set('Authorization', `Bearer ${admin.token}`)
    expect(coursesRes.status).toBe(200)
    expect(coursesRes.body.data.length).toBeGreaterThan(0)

    const analyticsRes = await request(app).get('/admin/analytics').set('Authorization', `Bearer ${admin.token}`)
    expect(analyticsRes.status).toBe(200)
    expect(analyticsRes.body.data.active_users).toBeDefined()
    expect(analyticsRes.body.data.top_courses).toBeDefined()
  })

  it('lets an admin deactivate a user', async () => {
    const admin = await registerUser('admin')
    const student = await registerUser('student')

    const res = await request(app)
      .put(`/admin/users/${student.userId}/deactivate`)
      .set('Authorization', `Bearer ${admin.token}`)
    expect(res.status).toBe(204)

    const getRes = await request(app).get(`/users/${student.userId}`).set('Authorization', `Bearer ${admin.token}`)
    expect(getRes.status).toBe(404)
  })

  it('lets an admin remove a course', async () => {
    const admin = await registerUser('admin')
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token)

    const res = await request(app).delete(`/admin/courses/${courseId}`).set('Authorization', `Bearer ${admin.token}`)
    expect(res.status).toBe(204)

    const getRes = await request(app).get(`/courses/${courseId}`)
    expect(getRes.status).toBe(404)
  })

  it('lets an admin list and review a fraud flag', async () => {
    const admin = await registerUser('admin')
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    await enroll(student.token, courseId)
    const enrollment = await enrollmentQueries.findEnrollmentByStudentAndCourse(student.userId, courseId)
    const flag = await fraudQueries.insertFraudFlag(student.userId, courseId, enrollment!.id, 0.87, 'Suspicious velocity')

    const listRes = await request(app).get('/admin/fraud-flags').set('Authorization', `Bearer ${admin.token}`)
    expect(listRes.status).toBe(200)
    expect(listRes.body.data.some((f: { id: string }) => f.id === flag.id)).toBe(true)

    const reviewRes = await request(app)
      .put(`/admin/fraud-flags/${flag.id}/review`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'dismissed' })
    expect(reviewRes.status).toBe(200)
    expect(reviewRes.body.data.status).toBe('dismissed')
    expect(reviewRes.body.data.reviewed_by).toBe(admin.userId)
  })

  it('rejects setting a fraud flag status back to pending', async () => {
    const admin = await registerUser('admin')
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    await enroll(student.token, courseId)
    const enrollment = await enrollmentQueries.findEnrollmentByStudentAndCourse(student.userId, courseId)
    const flag = await fraudQueries.insertFraudFlag(student.userId, courseId, enrollment!.id, 0.6, null)

    const res = await request(app)
      .put(`/admin/fraud-flags/${flag.id}/review`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'pending' })

    expect(res.status).toBe(400)
  })
})
