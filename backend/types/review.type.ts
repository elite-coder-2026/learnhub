export interface Review {
  id: string
  course_id: string
  student_id: string
  rating: number
  comment: string | null
  created_at: Date
  updated_at: Date
}

export interface ReviewWithStudent extends Review {
  first_name: string | null
  last_name: string | null
}

export interface CourseRatingSummary {
  average_rating: number
  review_count: number
}
