import { pool } from '../config/db'
import { Submission, SubmissionWithStudent } from '../types/submission.type'

const SUBMISSION_COLUMNS = `id, assignment_id, student_id, submission_text, file_url, status, grade, feedback, submitted_at, graded_at, created_at, updated_at`

export const insertSubmission = async (
  assignmentId: string,
  studentId: string,
  submissionText: string | null,
  fileUrl: string | null
): Promise<Submission> => {
  const result = await pool.query<Submission>(
    `INSERT INTO nx.submissions (assignment_id, student_id, submission_text, file_url)
     VALUES ($1, $2, $3, $4)
     RETURNING ${SUBMISSION_COLUMNS}`,
    [assignmentId, studentId, submissionText, fileUrl]
  )
  return result.rows[0]
}

export const updateSubmissionForResubmit = async (
  id: string,
  submissionText: string | null,
  fileUrl: string | null
): Promise<Submission | null> => {
  const result = await pool.query<Submission>(
    `UPDATE nx.submissions
     SET submission_text = $2,
         file_url = $3,
         status = 'submitted',
         grade = NULL,
         feedback = NULL,
         graded_at = NULL,
         submitted_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING ${SUBMISSION_COLUMNS}`,
    [id, submissionText, fileUrl]
  )
  return result.rows[0] ?? null
}

export const findSubmissionByAssignmentAndStudent = async (
  assignmentId: string,
  studentId: string
): Promise<Submission | null> => {
  const result = await pool.query<Submission>(
    `SELECT ${SUBMISSION_COLUMNS}
     FROM nx.submissions
     WHERE assignment_id = $1
       AND student_id = $2
       AND deleted_at IS NULL`,
    [assignmentId, studentId]
  )
  return result.rows[0] ?? null
}

export const findSubmissionById = async (id: string): Promise<Submission | null> => {
  const result = await pool.query<Submission>(
    `SELECT ${SUBMISSION_COLUMNS}
     FROM nx.submissions
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export const gradeSubmission = async (
  id: string,
  grade: number,
  feedback: string | null
): Promise<Submission | null> => {
  const result = await pool.query<Submission>(
    `UPDATE nx.submissions
     SET status = 'graded',
         grade = $2,
         feedback = $3,
         graded_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
       AND deleted_at IS NULL
     RETURNING ${SUBMISSION_COLUMNS}`,
    [id, grade, feedback]
  )
  return result.rows[0] ?? null
}

export const findSubmissionsByAssignment = async (
  assignmentId: string,
  cursor: string | null,
  limit: number
): Promise<SubmissionWithStudent[]> => {
  const result = await pool.query<SubmissionWithStudent>(
    `SELECT s.id, s.assignment_id, s.student_id, s.submission_text, s.file_url, s.status,
            s.grade, s.feedback, s.submitted_at, s.graded_at, s.created_at, s.updated_at,
            u.email AS student_email,
            u.first_name AS student_first_name,
            u.last_name AS student_last_name
     FROM nx.submissions s
     JOIN nx.users u ON u.id = s.student_id
     WHERE s.assignment_id = $1
       AND s.deleted_at IS NULL
       AND ($2::uuid IS NULL OR s.id > $2::uuid)
     ORDER BY s.id 
     LIMIT $3`,
    [assignmentId, cursor, limit]
  )
  return result.rows
}
