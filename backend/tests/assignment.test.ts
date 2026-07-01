import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser, createCourse, enroll } from './helpers'

describe('Assignments', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('lets the owning instructor create an assignment', async () => {
    const instructor = await registerUser('instructor')
    const courseId = await createCourse(instructor.token)

    const res = await request(app)
      .post(`/courses/${courseId}/assignments`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ title: 'Essay 1', description: 'Write an essay' })

    expect(res.status).toBe(201)
    expect(res.body.data.title).toBe('Essay 1')
  })

  it('blocks a non-owning instructor from creating an assignment', async () => {
    const owner = await registerUser('instructor')
    const other = await registerUser('instructor')
    const courseId = await createCourse(owner.token)

    const res = await request(app)
      .post(`/courses/${courseId}/assignments`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ title: 'Essay 1', description: null })

    expect(res.status).toBe(401)
  })

  it('blocks a non-enrolled student from submitting an assignment', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    const assignmentRes = await request(app)
      .post(`/courses/${courseId}/assignments`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ title: 'Essay 1', description: null })

    const res = await request(app)
      .post(`/assignments/${assignmentRes.body.data.id}/submit`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ submissionText: 'My essay', fileUrl: null })

    expect(res.status).toBe(401)
  })

  it('lets an enrolled student submit and resubmit an assignment, then be graded', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    await enroll(student.token, courseId)
    const assignmentRes = await request(app)
      .post(`/courses/${courseId}/assignments`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ title: 'Essay 1', description: null })
    const assignmentId = assignmentRes.body.data.id

    const submitRes = await request(app)
      .post(`/assignments/${assignmentId}/submit`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ submissionText: 'First draft', fileUrl: null })
    expect(submitRes.status).toBe(201)

    const resubmitRes = await request(app)
      .post(`/assignments/${assignmentId}/submit`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ submissionText: 'Final draft', fileUrl: null })
    expect(resubmitRes.status).toBe(201)
    expect(resubmitRes.body.data.id).toBe(submitRes.body.data.id)
    expect(resubmitRes.body.data.submission_text).toBe('Final draft')

    const mineRes = await request(app)
      .get(`/assignments/${assignmentId}/my-submission`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(mineRes.status).toBe(200)
    expect(mineRes.body.data.submission_text).toBe('Final draft')

    const listRes = await request(app)
      .get(`/assignments/${assignmentId}/submissions`)
      .set('Authorization', `Bearer ${instructor.token}`)
    expect(listRes.status).toBe(200)
    expect(listRes.body.data).toHaveLength(1)

    const gradeRes = await request(app)
      .put(`/submissions/${submitRes.body.data.id}/grade`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ grade: 95, feedback: 'Great work' })
    expect(gradeRes.status).toBe(200)
    expect(gradeRes.body.data.grade).toBe(95)
  })

  it('rejects an out-of-range grade', async () => {
    const instructor = await registerUser('instructor')
    const student = await registerUser('student')
    const courseId = await createCourse(instructor.token)
    await enroll(student.token, courseId)
    const assignmentRes = await request(app)
      .post(`/courses/${courseId}/assignments`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ title: 'Essay 1', description: null })
    const submitRes = await request(app)
      .post(`/assignments/${assignmentRes.body.data.id}/submit`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({ submissionText: 'Draft', fileUrl: null })

    const res = await request(app)
      .put(`/submissions/${submitRes.body.data.id}/grade`)
      .set('Authorization', `Bearer ${instructor.token}`)
      .send({ grade: 150, feedback: null })

    expect(res.status).toBe(400)
  })
})
