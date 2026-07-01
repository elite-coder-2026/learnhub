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
