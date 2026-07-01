import * as certificateQueries from '../queries/certificate.query'
import * as courseQueries from '../queries/course.query'
import * as enrollmentQueries from '../queries/enrollment.query'
import * as progressQueries from '../queries/progress.query'
import * as userQueries from '../queries/user.query'
import { Certificate } from '../types/certificate.type'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { generateCertificatePdf } from '../utils/certificateGenerator'
import { sendEmail } from '../utils/mailer'

export const issueCertificateIfEligible = async (
  studentId: string,
  courseId: string
): Promise<Certificate | null> => {
  const existing = await certificateQueries.findCertificateByStudentAndCourse(studentId, courseId)
  if (existing) return existing

  const enrollment = await enrollmentQueries.findEnrollmentByStudentAndCourse(studentId, courseId)
  if (!enrollment) return null

  const lessons = await progressQueries.findLessonStatusesForCourse(courseId, enrollment.id)
  const totalLessons = lessons.length
  const completedLessons = lessons.filter((lesson) => lesson.completed).length
  const isComplete = totalLessons > 0 && completedLessons === totalLessons
  if (!isComplete) return null

  const [student, course] = await Promise.all([
    userQueries.findUserById(studentId),
    courseQueries.findCourseById(courseId)
  ])
  if (!student || !course) return null

  const studentName = [student.first_name, student.last_name].filter(Boolean).join(' ') || student.email

  const certificate = await certificateQueries.insertCertificate(studentId, courseId, '')
  const filePath = await generateCertificatePdf({
    certificateId: certificate.id,
    studentName,
    courseTitle: course.title,
    issuedAt: certificate.issued_at
  })

  await certificateQueries.setCertificateFilePath(certificate.id, filePath)

  void sendEmail({
    to: student.email,
    subject: `You earned a certificate for ${course.title}`,
    text: `Congratulations ${studentName}! You've completed "${course.title}" and your certificate of completion is ready.`
  })

  return { ...certificate, file_path: filePath }
}

export const getCertificateForDownload = async (
  certificateId: string,
  requestingUserId: string
): Promise<Certificate> => {
  const certificate = await certificateQueries.findCertificateById(certificateId)
  if (!certificate) throw new NotFoundError(`Certificate ${certificateId} not found`)
  if (certificate.student_id !== requestingUserId) throw new UnauthorizedError('Not your certificate')
  return certificate
}

export const listCertificatesForStudent = async (studentId: string): Promise<Certificate[]> => {
  return certificateQueries.findCertificatesForStudent(studentId)
}
