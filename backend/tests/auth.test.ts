import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { randomUUID } from 'crypto'
import { app } from '../app'
import { pool } from '../config/db'

describe('Auth', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('registers a new user', async () => {
    const email = `student-${randomUUID()}@test.com`
    const res = await request(app).post('/auth/register').send({
      email,
      password: 'password123',
      firstName: 'Ada',
      lastName: 'Lovelace',
      userRole: 'student'
    })

    expect(res.status).toBe(201)
    expect(res.body.data.token).toEqual(expect.any(String))
    expect(res.body.data.userId).toEqual(expect.any(String))
  })

  it('rejects registering the same email twice', async () => {
    const email = `student-${randomUUID()}@test.com`
    const payload = {
      email,
      password: 'password123',
      firstName: 'Ada',
      lastName: 'Lovelace',
      userRole: 'student'
    }

    await request(app).post('/auth/register').send(payload)
    const res = await request(app).post('/auth/register').send(payload)

    expect(res.status).toBe(400)
  })

  it('rejects an invalid role', async () => {
    const res = await request(app).post('/auth/register').send({
      email: `bad-${randomUUID()}@test.com`,
      password: 'password123',
      firstName: 'Ada',
      lastName: 'Lovelace',
      userRole: 'superadmin'
    })

    expect(res.status).toBe(400)
  })

  it('logs in with correct credentials', async () => {
    const email = `student-${randomUUID()}@test.com`
    await request(app).post('/auth/register').send({
      email,
      password: 'password123',
      firstName: 'Ada',
      lastName: 'Lovelace',
      userRole: 'student'
    })

    const res = await request(app).post('/auth/login').send({ email, password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.data.token).toEqual(expect.any(String))
  })

  it('records the login time on successful login', async () => {
    const email = `student-${randomUUID()}@test.com`
    const registerRes = await request(app).post('/auth/register').send({
      email,
      password: 'password123',
      firstName: 'Ada',
      lastName: 'Lovelace',
      userRole: 'student'
    })
    const { token, userId } = registerRes.body.data

    const beforeLogin = await request(app).get(`/users/${userId}`).set('Authorization', `Bearer ${token}`)
    expect(beforeLogin.body.data.last_login_at).toBeNull()

    const loginRes = await request(app).post('/auth/login').send({ email, password: 'password123' })
    expect(loginRes.status).toBe(200)

    const afterLogin = await request(app).get(`/users/${userId}`).set('Authorization', `Bearer ${token}`)
    expect(afterLogin.body.data.last_login_at).toEqual(expect.any(String))
  })

  it('does not record a login time on a failed login', async () => {
    const email = `student-${randomUUID()}@test.com`
    const registerRes = await request(app).post('/auth/register').send({
      email,
      password: 'password123',
      firstName: 'Ada',
      lastName: 'Lovelace',
      userRole: 'student'
    })
    const { token, userId } = registerRes.body.data

    await request(app).post('/auth/login').send({ email, password: 'wrongpassword' })

    const res = await request(app).get(`/users/${userId}`).set('Authorization', `Bearer ${token}`)
    expect(res.body.data.last_login_at).toBeNull()
  })

  it('rejects login with wrong password', async () => {
    const email = `student-${randomUUID()}@test.com`
    await request(app).post('/auth/register').send({
      email,
      password: 'password123',
      firstName: 'Ada',
      lastName: 'Lovelace',
      userRole: 'student'
    })

    const res = await request(app).post('/auth/login').send({ email, password: 'wrongpassword' })

    expect(res.status).toBe(401)
  })

  it('rejects login for a nonexistent email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: `nobody-${randomUUID()}@test.com`, password: 'password123' })

    expect(res.status).toBe(401)
  })
})
