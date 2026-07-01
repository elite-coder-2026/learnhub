import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser } from './helpers'

describe('User', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('lets a user fetch their own profile without exposing password fields', async () => {
    const student = await registerUser('student')

    const res = await request(app).get(`/users/${student.userId}`).set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe(student.email)
    expect(res.body.data.password).toBeUndefined()
    expect(res.body.data.password_hash).toBeUndefined()
  })

  it('blocks a user from fetching another user\'s profile', async () => {
    const studentA = await registerUser('student')
    const studentB = await registerUser('student')

    const res = await request(app).get(`/users/${studentB.userId}`).set('Authorization', `Bearer ${studentA.token}`)

    expect(res.status).toBe(403)
  })

  it('lets an admin fetch any profile', async () => {
    const admin = await registerUser('admin')
    const student = await registerUser('student')

    const res = await request(app).get(`/users/${student.userId}`).set('Authorization', `Bearer ${admin.token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe(student.email)
  })

  it('lets a user update their own name', async () => {
    const student = await registerUser('student')

    const res = await request(app)
      .put(`/users/${student.userId}`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ firstName: 'Updated', lastName: 'Name', userRole: 'student' })

    expect(res.status).toBe(200)
    expect(res.body.data.first_name).toBe('Updated')
  })

  it('blocks a non-admin from changing their own role', async () => {
    const student = await registerUser('student')

    const res = await request(app)
      .put(`/users/${student.userId}`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ firstName: 'Test', lastName: 'student', userRole: 'instructor' })

    expect(res.status).toBe(401)
  })

  it('lets an admin change a user role', async () => {
    const admin = await registerUser('admin')
    const student = await registerUser('student')

    const res = await request(app)
      .put(`/users/${student.userId}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ firstName: 'Test', lastName: 'student', userRole: 'instructor' })

    expect(res.status).toBe(200)
    expect(res.body.data.user_role).toBe('instructor')
  })

  it('lets a user delete their own account', async () => {
    const student = await registerUser('student')

    const deleteRes = await request(app)
      .delete(`/users/${student.userId}`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(deleteRes.status).toBe(204)

    const getRes = await request(app).get(`/users/${student.userId}`).set('Authorization', `Bearer ${student.token}`)
    expect(getRes.status).toBe(404)
  })
})
