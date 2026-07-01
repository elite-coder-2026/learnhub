export interface ActiveUserCounts {
  student: number
  instructor: number
  admin: number
  total: number
}

export interface TopCourse {
  course_id: string
  title: string
  enrollment_count: number
}

export interface PlatformAnalytics {
  active_users: ActiveUserCounts
  top_courses: TopCourse[]
}
