import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { randomUUID } from 'crypto'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser, createCourse } from './helpers'

describe('Storage upload URLs', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('lets the owning instructor request a presigned upload URL', async () => {
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token)

    const res = await request(app)
      .post(`/courses/${courseId}/upload-url`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ contentType: 'video/mp4' })

    expect(res.status).toBe(201)
    expect(res.body.data.uploadUrl).toEqual(expect.any(String))
    expect(res.body.data.uploadUrl).toContain('learnhub-test-bucket')
    expect(res.body.data.key).toContain(`courses/${courseId}/lessons/`)
  })

  it('rejects an unsupported content type', async () => {
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token)

    const res = await request(app)
      .post(`/courses/${courseId}/upload-url`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ contentType: 'application/x-msdownload' })

    expect(res.status).toBe(400)
  })

  it('blocks a non-owning instructor from requesting an upload URL', async () => {
    const owner = await registerUser('instructor')
    const other = await registerUser('instructor')
    const courseId = await createCourse(owner.token)

    const res = await request(app)
      .post(`/courses/${courseId}/upload-url`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ contentType: 'video/mp4' })

    expect(res.status).toBe(401)
  })

  it('blocks a student from requesting an upload URL', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)

    const res = await request(app)
      .post(`/courses/${courseId}/upload-url`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ contentType: 'video/mp4' })

    expect(res.status).toBe(403)
  })

  it('returns 404 for a nonexistent course', async () => {
    const instructor = await registerUser('instructor')

    const res = await request(app)
      .post(`/courses/${randomUUID()}/upload-url`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ contentType: 'video/mp4' })

    expect(res.status).toBe(404)
  })
})
