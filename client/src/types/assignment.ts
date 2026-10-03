export interface Assignment {
  id: string
  course_id: string
  title: string
  description: string | null
  created_at: string
}

export type SubmissionStatus = 'submitted' | 'graded'

export interface SubmissionWithStudent {
  id: string
  assignment_id: string
  student_id: string
  submission_text: string | null
  file_url: string | null
  status: SubmissionStatus
  grade: number | null
  feedback: string | null
  submitted_at: string
  graded_at: string | null
  student_email: string
  student_first_name: string | null
  student_last_name: string | null
}

export interface GradeSubmissionInput {
  grade: number
  feedback: string | null
}
