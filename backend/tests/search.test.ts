import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { randomInt } from 'crypto'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser, createCourse } from './helpers'

const uniqueWord = (): string =>
  Array.from({ length: 12 }, () => String.fromCharCode(97 + randomInt(26))).join('')

interface CourseRow {
  id: string
  title: string
}

describe('Course search', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('matches words in any order', async () => {
    const instructor = await registerUser('instructor')
    const word = uniqueWord()
    const courseId = await createCourse(instructor.token, { title: `React Testing Guide ${word}` })

    const res = await request(app).get('/courses').query({ search: `${word} testing react` })

    expect(res.status).toBe(200)
    expect(res.body.data.map((course: CourseRow) => course.id)).toEqual([courseId])
  })

  it('matches stemmed word forms', async () => {
    const instructor = await registerUser('instructor')
    const word = uniqueWord()
    const courseId = await createCourse(instructor.token, { title: `Running Pipelines ${word}` })

    const res = await request(app).get('/courses').query({ search: `run pipeline ${word}` })

    expect(res.status).toBe(200)
    expect(res.body.data.map((course: CourseRow) => course.id)).toEqual([courseId])
  })

  it('ranks title matches above description matches', async () => {
    const instructor = await registerUser('instructor')
    const word = uniqueWord()
    const descriptionMatchId = await createCourse(instructor.token, {
      title: 'Unrelated Title',
      description: `Covers ${word} in depth`
    })
    const titleMatchId = await createCourse(instructor.token, { title: `Mastering ${word}` })

    const res = await request(app).get('/courses').query({ search: word })

    expect(res.status).toBe(200)
    expect(res.body.data.map((course: CourseRow) => course.id)).toEqual([titleMatchId, descriptionMatchId])
  })

  it('returns no results for a non-matching term', async () => {
    const res = await request(app).get('/courses').query({ search: uniqueWord() })

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
    expect(res.body.hasMore).toBe(false)
    expect(res.body.nextCursor).toBeNull()
  })

  it('paginates ranked results with a cursor without duplicates or gaps', async () => {
    const instructor = await registerUser('instructor')
    const word = uniqueWord()
    const createdIds = [
      await createCourse(instructor.token, { title: `${word} One` }),
      await createCourse(instructor.token, { title: `${word} Two` }),
      await createCourse(instructor.token, { title: 'Other', description: `About ${word}` })
    ]

    const firstPage = await request(app).get('/courses').query({ search: word, limit: 2 })
    expect(firstPage.status).toBe(200)
    expect(firstPage.body.data).toHaveLength(2)
    expect(firstPage.body.hasMore).toBe(true)

    const secondPage = await request(app)
      .get('/courses')
      .query({ search: word, limit: 2, cursor: firstPage.body.nextCursor })
    expect(secondPage.status).toBe(200)
    expect(secondPage.body.data).toHaveLength(1)
    expect(secondPage.body.hasMore).toBe(false)

    const pagedIds = [...firstPage.body.data, ...secondPage.body.data].map((course: CourseRow) => course.id)
    expect(new Set(pagedIds).size).toBe(3)
    expect([...pagedIds].sort()).toEqual([...createdIds].sort())
    expect(pagedIds[2]).toBe(createdIds[2])
  })
})
