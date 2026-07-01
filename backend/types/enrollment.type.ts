export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  enrolled_at: Date
  created_at: Date
  updated_at: Date
}

export interface EnrolledStudent {
  enrollment_id: string
  student_id: string
  email: string
  first_name: string | null
  last_name: string | null
  enrolled_at: Date
}
