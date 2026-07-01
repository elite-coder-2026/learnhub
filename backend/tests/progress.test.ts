import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { randomUUID } from 'crypto'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser, createCourse, enroll } from './helpers'

const courseWithOneLesson = {
  modules: [
    {
      title: 'Module 1',
      lessons: [{ title: 'Lesson 1', contentUrl: 'https://cdn.test/l1.mp4' }]
    }
  ]
}

describe('Progress', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('blocks a non-enrolled student from viewing lesson content', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token, courseWithOneLesson)
    const courseRes = await request(app).get(`/courses/${courseId}`)
    const lessonId = courseRes.body.data.modules[0].lessons[0].id

    const res = await request(app).get(`/lessons/${lessonId}`).set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(401)
  })

  it('lets an enrolled student view, complete, and uncomplete a lesson', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token, courseWithOneLesson)
    const courseRes = await request(app).get(`/courses/${courseId}`)
    const lessonId = courseRes.body.data.modules[0].lessons[0].id
    await enroll(student.token, courseId)

    const viewRes = await request(app).get(`/lessons/${lessonId}`).set('Authorization', `Bearer ${student.token}`)
    expect(viewRes.status).toBe(200)

    const completeRes = await request(app)
      .post(`/lessons/${lessonId}/complete`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(completeRes.status).toBe(200)
    expect(completeRes.body.data.completed_at).not.toBeNull()

    const progressRes = await request(app)
      .get(`/courses/${courseId}/progress`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(progressRes.status).toBe(200)
    expect(progressRes.body.data.percent_complete).toBe(100)

    const uncompleteRes = await request(app)
      .delete(`/lessons/${lessonId}/complete`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(uncompleteRes.status).toBe(200)
    expect(uncompleteRes.body.data.completed_at).toBeNull()
  })

  it('returns 404 for a nonexistent lesson', async () => {
    const student = await registerUser('student')

    const res = await request(app).get(`/lessons/${randomUUID()}`).set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(404)
  })

  it('returns an empty dashboard for a student with no enrollments', async () => {
    const student = await registerUser('student')

    const res = await request(app).get('/dashboard').set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.inProgress).toEqual([])
    expect(res.body.data.completed).toEqual([])
  })
})
