import * as courseQueries from '../queries/course.query'
import * as enrollmentQueries from '../queries/enrollment.query'
import * as assignmentQueries from '../queries/assignment.query'
import * as submissionQueries from '../queries/submission.query'
import * as userQueries from '../queries/user.query'
import { Assignment, CreateAssignmentInput } from '../types/assignment.type'
import { PaginatedResponse } from '../types/progress.type'
import { GradeSubmissionInput, Submission, SubmissionWithStudent, SubmitAssignmentInput } from '../types/submission.type'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'
import { sendEmail } from '../utils/mailer'

const getAssignmentOrThrow = async (assignmentId: string): Promise<Assignment> => {
  const assignment = await assignmentQueries.findAssignmentById(assignmentId)
  if (!assignment) throw new NotFoundError(`Assignment ${assignmentId} not found`)
  return assignment
}

const assertInstructorOwnsCourse = async (instructorId: string, courseId: string): Promise<void> => {
  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)
  if (course.instructor_id !== instructorId) throw new UnauthorizedError('You do not own this course')
}

export const createAssignment = async (
  instructorId: string,
  courseId: string,
  input: CreateAssignmentInput
): Promise<Assignment> => {
  if (!input.title.trim()) throw new ValidationError('Assignment title is required')
  await assertInstructorOwnsCourse(instructorId, courseId)

  return assignmentQueries.insertAssignment(courseId, input.title, input.description)
}

export const getAssignmentsForCourse = async (courseId: string): Promise<Assignment[]> => {
  return assignmentQueries.findAssignmentsByCourseId(courseId)
}

export const submitAssignment = async (
  studentId: string,
  assignmentId: string,
  input: SubmitAssignmentInput
): Promise<Submission> => {
  if (!input.submissionText?.trim() && !input.fileUrl?.trim()) {
    throw new ValidationError('A submission must include text or a file URL')
  }

  const assignment = await getAssignmentOrThrow(assignmentId)
  const enrollment = await enrollmentQueries.findEnrollmentByStudentAndCourse(studentId, assignment.course_id)
  if (!enrollment) throw new UnauthorizedError('Not enrolled in this course')

  const existing = await submissionQueries.findSubmissionByAssignmentAndStudent(assignmentId, studentId)
  if (existing) {
    const updated = await submissionQueries.updateSubmissionForResubmit(
      existing.id,
      input.submissionText,
      input.fileUrl
    )
    if (!updated) throw new NotFoundError(`Submission ${existing.id} not found`)
    return updated
  }

  return submissionQueries.insertSubmission(assignmentId, studentId, input.submissionText, input.fileUrl)
}

export const getMySubmission = async (studentId: string, assignmentId: string): Promise<Submission | null> => {
  await getAssignmentOrThrow(assignmentId)
  return submissionQueries.findSubmissionByAssignmentAndStudent(assignmentId, studentId)
}

export const getSubmissionsForAssignment = async (
  instructorId: string,
  assignmentId: string,
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<SubmissionWithStudent>> => {
  const assignment = await getAssignmentOrThrow(assignmentId)
  await assertInstructorOwnsCourse(instructorId, assignment.course_id)

  const rows = await submissionQueries.findSubmissionsByAssignment(assignmentId, cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].id : null

  return { data, nextCursor, hasMore }
}

export const gradeSubmission = async (
  instructorId: string,
  submissionId: string,
  input: GradeSubmissionInput
): Promise<Submission> => {
  if (!Number.isInteger(input.grade) || input.grade < 0 || input.grade > 100) {
    throw new ValidationError('Grade must be an integer between 0 and 100')
  }

  const submission = await submissionQueries.findSubmissionById(submissionId)
  if (!submission) throw new NotFoundError(`Submission ${submissionId} not found`)

  const assignment = await getAssignmentOrThrow(submission.assignment_id)
  await assertInstructorOwnsCourse(instructorId, assignment.course_id)

  const graded = await submissionQueries.gradeSubmission(submissionId, input.grade, input.feedback)
  if (!graded) throw new NotFoundError(`Submission ${submissionId} not found`)

  const student = await userQueries.findUserById(graded.student_id)
  if (student) {
    void sendEmail({
      to: student.email,
      subject: `Your assignment "${assignment.title}" has been graded`,
      text: `Hi ${student.first_name ?? 'there'}, your submission for "${assignment.title}" was graded: ${input.grade}/100.${input.feedback ? ` Feedback: ${input.feedback}` : ''}`
    })
  }

  return graded
}
