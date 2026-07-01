export type SubmissionStatus = 'submitted' | 'graded'

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  submission_text: string | null
  file_url: string | null
  status: SubmissionStatus
  grade: number | null
  feedback: string | null
  submitted_at: Date
  graded_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface SubmitAssignmentInput {
  submissionText: string | null
  fileUrl: string | null
}

export interface GradeSubmissionInput {
  grade: number
  feedback: string | null
}

export interface SubmissionWithStudent extends Submission {
  student_email: string
  student_first_name: string | null
  student_last_name: string | null
}
