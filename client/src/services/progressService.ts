import { apiDelete, apiGet, apiPost } from './apiClient'
import type { CourseLesson, CourseProgress } from '../types/course'

export function getCourseProgress(
  courseId: string,
  token: string,
): Promise<CourseProgress> {
  return apiGet<CourseProgress>(`/courses/${courseId}/progress`, token)
}

export function getLesson(lessonId: string, token: string): Promise<CourseLesson> {
  return apiGet<CourseLesson>(`/lessons/${lessonId}`, token)
}

export function completeLesson(lessonId: string, token: string): Promise<void> {
  return apiPost<unknown>(`/lessons/${lessonId}/complete`, undefined, token).then(
    () => undefined,
  )
}

export function uncompleteLesson(lessonId: string, token: string): Promise<void> {
  return apiDelete(`/lessons/${lessonId}/complete`, token)
}
