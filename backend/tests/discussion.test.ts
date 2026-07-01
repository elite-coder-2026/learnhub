import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
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

describe('Discussion', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('blocks a non-enrolled student from posting', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token, courseWithOneLesson)
    const courseRes = await request(app).get(`/courses/${courseId}`)
    const lessonId = courseRes.body.data.modules[0].lessons[0].id

    const res = await request(app)
      .post(`/lessons/${lessonId}/discussion`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ body: 'Question about this lesson' })

    expect(res.status).toBe(401)
  })

  it('lets an enrolled student post and read discussion posts', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token, courseWithOneLesson)
    const courseRes = await request(app).get(`/courses/${courseId}`)
    const lessonId = courseRes.body.data.modules[0].lessons[0].id
    await enroll(student.token, courseId)

    const postRes = await request(app)
      .post(`/lessons/${lessonId}/discussion`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ body: 'Question about this lesson' })
    expect(postRes.status).toBe(201)

    const listRes = await request(app)
      .get(`/lessons/${lessonId}/discussion`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(listRes.status).toBe(200)
    expect(listRes.body.data).toHaveLength(1)
  })

  it('lets the owning instructor post without enrollment', async () => {
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token, courseWithOneLesson)
    const courseRes = await request(app).get(`/courses/${courseId}`)
    const lessonId = courseRes.body.data.modules[0].lessons[0].id

    const res = await request(app)
      .post(`/lessons/${lessonId}/discussion`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ body: 'Welcome to the lesson' })

    expect(res.status).toBe(201)
  })

  it('rejects an empty post body', async () => {
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token, courseWithOneLesson)
    const courseRes = await request(app).get(`/courses/${courseId}`)
    const lessonId = courseRes.body.data.modules[0].lessons[0].id

    const res = await request(app)
      .post(`/lessons/${lessonId}/discussion`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ body: '   ' })

    expect(res.status).toBe(400)
  })
})
