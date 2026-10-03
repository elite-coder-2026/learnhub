import { useCallback, useMemo, useState } from 'react'
import type { CreateCourseInput } from '../types/course'

export interface LessonDraft {
  key: string
  title: string
  contentUrl: string
}

export interface ModuleDraft {
  key: string
  title: string
  lessons: LessonDraft[]
}

export interface CourseFormErrors {
  title?: string
  modules: Record<string, string>
  lessons: Record<string, string>
}

export interface UseCourseFormResult {
  title: string
  description: string
  modules: ModuleDraft[]
  errors: CourseFormErrors
  hasErrors: boolean
  lessonCount: number
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  addModule: () => void
  removeModule: (moduleKey: string) => void
  updateModuleTitle: (moduleKey: string, title: string) => void
  addLesson: (moduleKey: string) => void
  removeLesson: (moduleKey: string, lessonKey: string) => void
  updateLesson: (moduleKey: string, lessonKey: string, patch: Partial<Omit<LessonDraft, 'key'>>) => void
  markSubmitted: () => void
  toInput: () => CreateCourseInput
}

const createLesson = (): LessonDraft => ({ key: crypto.randomUUID(), title: '', contentUrl: '' })

const createModule = (): ModuleDraft => ({
  key: crypto.randomUUID(),
  title: '',
  lessons: [createLesson()],
})

const validate = (title: string, modules: ModuleDraft[]): CourseFormErrors => {
  const errors: CourseFormErrors = { modules: {}, lessons: {} }

  if (!title.trim()) errors.title = 'Course title is required'

  for (const courseModule of modules) {
    if (!courseModule.title.trim()) errors.modules[courseModule.key] = 'Module title is required'
    for (const lesson of courseModule.lessons) {
      if (!lesson.title.trim()) errors.lessons[lesson.key] = 'Lesson title is required'
    }
  }

  return errors
}

export const useCourseForm = (): UseCourseFormResult => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [modules, setModules] = useState<ModuleDraft[]>(() => [createModule()])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validation = useMemo(() => validate(title, modules), [title, modules])
  const hasErrors =
    Boolean(validation.title) ||
    Object.keys(validation.modules).length > 0 ||
    Object.keys(validation.lessons).length > 0

  const errors: CourseFormErrors = isSubmitted ? validation : { modules: {}, lessons: {} }

  const updateModule = useCallback(
    (moduleKey: string, update: (courseModule: ModuleDraft) => ModuleDraft): void => {
      setModules((prev) => prev.map((m) => (m.key === moduleKey ? update(m) : m)))
    },
    [],
  )

  return {
    title,
    description,
    modules,
    errors,
    hasErrors,
    lessonCount: modules.reduce((sum, m) => sum + m.lessons.length, 0),
    setTitle,
    setDescription,
    addModule: () => setModules((prev) => [...prev, createModule()]),
    removeModule: (moduleKey) => setModules((prev) => prev.filter((m) => m.key !== moduleKey)),
    updateModuleTitle: (moduleKey, nextTitle) =>
      updateModule(moduleKey, (m) => ({ ...m, title: nextTitle })),
    addLesson: (moduleKey) =>
      updateModule(moduleKey, (m) => ({ ...m, lessons: [...m.lessons, createLesson()] })),
    removeLesson: (moduleKey, lessonKey) =>
      updateModule(moduleKey, (m) => ({
        ...m,
        lessons: m.lessons.filter((lesson) => lesson.key !== lessonKey),
      })),
    updateLesson: (moduleKey, lessonKey, patch) =>
      updateModule(moduleKey, (m) => ({
        ...m,
        lessons: m.lessons.map((lesson) => (lesson.key === lessonKey ? { ...lesson, ...patch } : lesson)),
      })),
    markSubmitted: () => setIsSubmitted(true),
    toInput: () => ({
      title: title.trim(),
      description: description.trim() || null,
      modules: modules.map((m) => ({
        title: m.title.trim(),
        lessons: m.lessons.map((lesson) => ({
          title: lesson.title.trim(),
          contentUrl: lesson.contentUrl.trim() || null,
        })),
      })),
    }),
  }
}
