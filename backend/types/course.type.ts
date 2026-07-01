export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Course {
  id: string
  instructor_id: string
  title: string
  description: string | null
  category: string | null
  level: CourseLevel | null
  created_at: Date
  updated_at: Date
}

export interface CourseSearchFilters {
  search: string | null
  category: string | null
  instructorId: string | null
  level: CourseLevel | null
}

export interface CourseAnalytics {
  course_id: string
  title: string
  enrollment_count: number
  completion_rate: number
}

export interface Module {
  id: string
  course_id: string
  title: string
  position: number
  created_at: Date
  updated_at: Date
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  content_url: string | null
  position: number
  created_at: Date
  updated_at: Date
}

export interface CreateLessonInput {
  title: string
  contentUrl: string | null
}

export interface CreateModuleInput {
  title: string
  lessons: CreateLessonInput[]
}

export interface CreateCourseInput {
  title: string
  description: string | null
  modules: CreateModuleInput[]
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[]
}

export interface CourseWithStructure extends Course {
  modules: ModuleWithLessons[]
}

export interface DownloadableLesson {
  lesson_id: string
  module_id: string
  title: string
  content_url: string | null
}

export interface UpdateCourseInput {
  title: string
  description: string | null
}

export interface AddModuleInput {
  title: string
}

export interface UpdateModuleInput {
  title: string
  position: number
}

export interface UpdateLessonInput {
  title: string
  contentUrl: string | null
  position: number
}
