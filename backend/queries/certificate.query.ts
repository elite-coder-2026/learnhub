import { pool } from '../config/db'
import { Certificate } from '../types/certificate.type'

export const findCertificateByStudentAndCourse = async (
  studentId: string,
  courseId: string
): Promise<Certificate | null> => {
  const result = await pool.query<Certificate>(
    `SELECT id, student_id, course_id, file_path, issued_at, created_at, updated_at
     FROM nx.certificates
     WHERE student_id = $1
       AND course_id = $2
       AND deleted_at IS NULL`,
    [studentId, courseId]
  )
  return result.rows[0] ?? null
}

export const findCertificateById = async (id: string): Promise<Certificate | null> => {
  const result = await pool.query<Certificate>(
    `SELECT id, student_id, course_id, file_path, issued_at, created_at, updated_at
     FROM nx.certificates
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id]
  )
  return result.rows[0] ?? null
}

export const findCertificatesForStudent = async (studentId: string): Promise<Certificate[]> => {
  const result = await pool.query<Certificate>(
    `SELECT id, student_id, course_id, file_path, issued_at, created_at, updated_at
     FROM nx.certificates
     WHERE student_id = $1
       AND deleted_at IS NULL
     ORDER BY issued_at DESC`,
    [studentId]
  )
  return result.rows
}

export const insertCertificate = async (
  studentId: string,
  courseId: string,
  filePath: string
): Promise<Certificate> => {
  const result = await pool.query<Certificate>(
    `INSERT INTO nx.certificates (student_id, course_id, file_path)
     VALUES ($1, $2, $3)
     RETURNING id, student_id, course_id, file_path, issued_at, created_at, updated_at`,
    [studentId, courseId, filePath]
  )
  return result.rows[0]
}

export const setCertificateFilePath = async (id: string, filePath: string): Promise<void> => {
  await pool.query(
    `UPDATE nx.certificates
     SET file_path = $2,
         updated_at = NOW()
     WHERE id = $1`,
    [id, filePath]
  )
}
