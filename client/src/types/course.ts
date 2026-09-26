export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Course {
  id: string
  instructor_id: string
  title: string
  description: string
  category: string | null
  level: CourseLevel | null
  created_at: string
  updated_at: string
}

export interface CourseLesson {
  id: string
  module_id: string
  title: string
  content_url: string
  position: number
  created_at: string
  updated_at: string
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  position: number
  created_at: string
  updated_at: string
  lessons: CourseLesson[]
}

export interface CourseWithStructure extends Course {
  modules: CourseModule[]
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

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  enrolled_at: string
  created_at: string
  updated_at: string
}

export interface LessonProgress {
  lesson_id: string
  module_id: string
  title: string
  position: number
  completed: boolean
  completed_at: string | null
}

export interface CourseProgress {
  course_id: string
  total_lessons: number
  completed_lessons: number
  percent_complete: number
  lessons: LessonProgress[]
}
