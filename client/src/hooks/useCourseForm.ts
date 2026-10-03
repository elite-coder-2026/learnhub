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
  price?: string
  modules: Record<string, string>
  lessons: Record<string, string>
}

export interface UseCourseFormResult {
  title: string
  description: string
  price: string
  modules: ModuleDraft[]
  errors: CourseFormErrors
  hasErrors: boolean
  lessonCount: number
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setPrice: (price: string) => void
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

const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/
const MAX_PRICE = 9999.99

const toPriceCents = (price: string): number => (price.trim() === '' ? 0 : Math.round(Number(price) * 100))

const validate = (title: string, price: string, modules: ModuleDraft[]): CourseFormErrors => {
  const errors: CourseFormErrors = { modules: {}, lessons: {} }

  if (!title.trim()) errors.title = 'Course title is required'
  const trimmedPrice = price.trim()
  if (trimmedPrice !== '' && (!PRICE_PATTERN.test(trimmedPrice) || Number(trimmedPrice) > MAX_PRICE)) {
    errors.price = 'Enter a price between 0 and 9999.99, like 49.99'
  }

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
  const [price, setPrice] = useState('')
  const [modules, setModules] = useState<ModuleDraft[]>(() => [createModule()])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validation = useMemo(() => validate(title, price, modules), [title, price, modules])
  const hasErrors =
    Boolean(validation.title) ||
    Boolean(validation.price) ||
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
    price,
    modules,
    errors,
    hasErrors,
    lessonCount: modules.reduce((sum, m) => sum + m.lessons.length, 0),
    setTitle,
    setDescription,
    setPrice,
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
      priceCents: toPriceCents(price),
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
