import request from 'supertest'
import { describe, it, expect, afterAll } from '@jest/globals'
import { app } from '../app'
import { pool } from '../config/db'
import { registerUser } from './helpers'
import * as notificationQueries from '../queries/notification.query'

describe('Notifications', () => {
  afterAll(async () => {
    await pool.end()
  })

  it('lists a user\'s own notifications and reports an unread count', async () => {
    const student = await registerUser('student')
    await notificationQueries.createNotification({
      userId: student.userId,
      actionId: null,
      type: 'info',
      title: 'Welcome',
      message: 'Welcome to LearnHub',
      contentLabel: null,
      contentUrl: null,
      quote: null
    })

    const listRes = await request(app).get('/notifications').set('Authorization', `Bearer ${student.token}`)
    expect(listRes.status).toBe(200)
    expect(listRes.body.data).toHaveLength(1)

    const countRes = await request(app)
      .get('/notifications/unread-count')
      .set('Authorization', `Bearer ${student.token}`)
    expect(countRes.status).toBe(200)
    expect(countRes.body.data.count).toBe(1)
  })

  it('marks a single notification as read', async () => {
    const student = await registerUser('student')
    const notification = await notificationQueries.createNotification({
      userId: student.userId,
      actionId: null,
      type: 'info',
      title: 'Hello',
      message: null,
      contentLabel: null,
      contentUrl: null,
      quote: null
    })

    const res = await request(app)
      .put(`/notifications/${notification.id}/read`)
      .set('Authorization', `Bearer ${student.token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.read_at).not.toBeNull()
  })

  it('blocks a user from reading someone else\'s notification', async () => {
    const owner = await registerUser('student')
    const intruder = await registerUser('student')
    const notification = await notificationQueries.createNotification({
      userId: owner.userId,
      actionId: null,
      type: 'info',
      title: 'Private',
      message: null,
      contentLabel: null,
      contentUrl: null,
      quote: null
    })

    const res = await request(app)
      .put(`/notifications/${notification.id}/read`)
      .set('Authorization', `Bearer ${intruder.token}`)

    expect(res.status).toBe(401)
  })

  it('marks all notifications as read', async () => {
    const student = await registerUser('student')
    await notificationQueries.createNotification({
      userId: student.userId,
      actionId: null,
      type: 'info',
      title: 'One',
      message: null,
      contentLabel: null,
      contentUrl: null,
      quote: null
    })
    await notificationQueries.createNotification({
      userId: student.userId,
      actionId: null,
      type: 'info',
      title: 'Two',
      message: null,
      contentLabel: null,
      contentUrl: null,
      quote: null
    })

    const res = await request(app)
      .put('/notifications/read-all')
      .set('Authorization', `Bearer ${student.token}`)
    expect(res.status).toBe(204)

    const countRes = await request(app)
      .get('/notifications/unread-count')
      .set('Authorization', `Bearer ${student.token}`)
    expect(countRes.body.data.count).toBe(0)
  })

  it('deletes a notification', async () => {
    const student = await registerUser('student')
    const notification = await notificationQueries.createNotification({
      userId: student.userId,
      actionId: null,
      type: 'info',
      title: 'Delete me',
      message: null,
      contentLabel: null,
      contentUrl: null,
      quote: null
    })

    const deleteRes = await request(app)
      .delete(`/notifications/${notification.id}`)
      .set('Authorization', `Bearer ${student.token}`)
    expect(deleteRes.status).toBe(204)

    const listRes = await request(app).get('/notifications').set('Authorization', `Bearer ${student.token}`)
    expect(listRes.body.data).toHaveLength(0)
  })
})
