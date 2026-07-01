export interface LessonProgress {
  id: string
  enrollment_id: string
  lesson_id: string
  completed_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

export interface LessonStatus {
  lesson_id: string
  module_id: string
  title: string
  position: number
  completed: boolean
  completed_at: Date | null
}

export interface CourseProgress {
  course_id: string
  total_lessons: number
  completed_lessons: number
  percent_complete: number
  lessons: LessonStatus[]
}

export interface DashboardCourse {
  course_id: string
  title: string
  description: string | null
  total_lessons: number
  completed_lessons: number
  percent_complete: number
}

export interface StudentDashboard {
  inProgress: DashboardCourse[]
  completed: DashboardCourse[]
}
