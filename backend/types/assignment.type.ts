export interface Assignment {
  id: string
  course_id: string
  title: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export interface CreateAssignmentInput {
  title: string
  description: string | null
}
