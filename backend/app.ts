import express, { Express } from 'express'
import cors from 'cors'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import courseRoutes from './routes/course.routes'
import progressRoutes from './routes/progress.routes'
import notificationRoutes from './routes/notification.routes'
import assignmentRoutes from './routes/assignment.routes'
import adminRoutes from './routes/admin.routes'
import certificateRoutes from './routes/certificate.routes'
import discussionRoutes from './routes/discussion.routes'
import wishlistRoutes from './routes/wishlist.routes'

export const app: Express = express()

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/courses', courseRoutes)
app.use('/', progressRoutes)
app.use('/notifications', notificationRoutes)
app.use('/', assignmentRoutes)
app.use('/admin', adminRoutes)
app.use('/certificates', certificateRoutes)
app.use('/', discussionRoutes)
app.use('/wishlist', wishlistRoutes)
