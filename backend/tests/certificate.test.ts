import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import fs from 'fs'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser, createCourse, enroll } from './helpers'

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const waitForCertificate = async (token: string, attempts = 20): Promise<{ id: string; file_path: string }[]> => {
  for (let i = 0; i < attempts; i++) {
    const res = await request(app).get('/certificates').set('Authorization', `Bearer ${token}`)
    if (res.body.data.length > 0) return res.body.data
    await sleep(100)
  }
  return []
}

describe('Certificates', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('returns an empty list for a student with no certificates', async () => {
    const student = await registerUser('student')

    const res = await request(app).get('/certificates').set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
  })

  it('returns 404 when downloading a nonexistent certificate', async () => {
    const student = await registerUser('student')

    const res = await request(app)
      .get('/certificates/00000000-0000-0000-0000-000000000000/download')
      .set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(404)
  })

  it('issues a certificate once every lesson in the course is completed, and lets the student download it', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token, {
      modules: [
        {
          title: 'Module 1',
          lessons: [{ title: 'Only Lesson', contentUrl: 'https://cdn.test/l1.mp4' }]
        }
      ]
    })
    const courseRes = await request(app).get(`/courses/${courseId}`)
    const lessonId = courseRes.body.data.modules[0].lessons[0].id
    await enroll(student.token, courseId)

    const completeRes = await request(app)
      .post(`/lessons/${lessonId}/complete`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(completeRes.status).toBe(200)

    const certificates = await waitForCertificate(student.token)
    expect(certificates).toHaveLength(1)

    const downloadRes = await request(app)
      .get(`/certificates/${certificates[0].id}/download`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(downloadRes.status).toBe(200)
    expect(downloadRes.headers['content-type']).toBe('application/pdf')

    fs.rmSync(certificates[0].file_path, { force: true })
  })

  it('blocks a student from downloading another student\'s certificate', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const intruder = await registerUser('student')
    const courseId = await createCourse(instructor.token, {
      modules: [
        {
          title: 'Module 1',
          lessons: [{ title: 'Only Lesson', contentUrl: 'https://cdn.test/l1.mp4' }]
        }
      ]
    })
    const courseRes = await request(app).get(`/courses/${courseId}`)
    const lessonId = courseRes.body.data.modules[0].lessons[0].id
    await enroll(student.token, courseId)
    await request(app).post(`/lessons/${lessonId}/complete`).set('Authorization', `Bearer ${student.token}`)

    const certificates = await waitForCertificate(student.token)
    expect(certificates).toHaveLength(1)

    const res = await request(app)
      .get(`/certificates/${certificates[0].id}/download`)
      .set('Authorization', `Bearer ${intruder.token}`)

    expect(res.status).toBe(401)

    fs.rmSync(certificates[0].file_path, { force: true })
  })
})
