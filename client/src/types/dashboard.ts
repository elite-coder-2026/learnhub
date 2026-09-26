export interface StudentCourseProgress {
  course_id: string
  title: string
  description: string
  total_lessons: number
  completed_lessons: number
  percent_complete: number
}

export interface StudentDashboard {
  inProgress: StudentCourseProgress[]
  completed: StudentCourseProgress[]
}

export interface InstructorCourseAnalytics {
  course_id: string
  title: string
  enrollment_count: number
  completion_rate: number
}

export interface AdminActiveUsers {
  student: number
  instructor: number
  admin: number
  total: number
}

export interface AdminTopCourse {
  course_id: string
  title: string
  enrollment_count: number
}

export interface AdminAnalytics {
  active_users: AdminActiveUsers
  top_courses: AdminTopCourse[]
}
