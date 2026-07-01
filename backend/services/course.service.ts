import { pool } from '../config/db'
import * as courseQueries from '../queries/course.query'
import * as lessonQueries from '../queries/lesson.query'
import * as enrollmentQueries from '../queries/enrollment.query'
import {
  Course,
  CourseAnalytics,
  CreateCourseInput,
  CreateLessonInput,
  CourseWithStructure,
  ModuleWithLessons,
  Module,
  Lesson,
  AddModuleInput,
  UpdateCourseInput,
  UpdateModuleInput,
  UpdateLessonInput,
  DownloadableLesson
} from '../types/course.type'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'

export const createCourse = async (
  instructorId: string,
  input: CreateCourseInput
): Promise<CourseWithStructure> => {
  if (!input.title.trim()) throw new ValidationError('Course title is required')
  for (const courseModule of input.modules) {
    if (!courseModule.title.trim()) throw new ValidationError('Module title is required')
    for (const lesson of courseModule.lessons) {
      if (!lesson.title.trim()) throw new ValidationError('Lesson title is required')
    }
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const course = await courseQueries.insertCourse(client, instructorId, input.title, input.description)

    const modules: ModuleWithLessons[] = []
    for (let moduleIndex = 0; moduleIndex < input.modules.length; moduleIndex++) {
      const moduleInput = input.modules[moduleIndex]
      const module = await courseQueries.insertModule(client, course.id, moduleInput.title, moduleIndex)

      const lessons = []
      for (let lessonIndex = 0; lessonIndex < moduleInput.lessons.length; lessonIndex++) {
        const lessonInput = moduleInput.lessons[lessonIndex]
        const lesson = await courseQueries.insertLesson(
          client,
          module.id,
          lessonInput.title,
          lessonInput.contentUrl,
          lessonIndex
        )
        lessons.push(lesson)
      }

      modules.push({ ...module, lessons })
    }

    await client.query('COMMIT')
    return { ...course, modules }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export const getAnalyticsForInstructor = async (instructorId: string): Promise<CourseAnalytics[]> => {
  return courseQueries.findAnalyticsForInstructor(instructorId)
}

const getCourseOrThrow = async (courseId: string): Promise<Course> => {
  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)
  return course
}

const getModuleOrThrow = async (moduleId: string): Promise<Module> => {
  const module = await courseQueries.findModuleById(moduleId)
  if (!module) throw new NotFoundError(`Module ${moduleId} not found`)
  return module
}

const getLessonOrThrow = async (lessonId: string): Promise<Lesson> => {
  const lesson = await lessonQueries.findLessonById(lessonId)
  if (!lesson) throw new NotFoundError(`Lesson ${lessonId} not found`)
  return lesson
}

const assertInstructorOwnsCourse = async (instructorId: string, courseId: string): Promise<Course> => {
  const course = await getCourseOrThrow(courseId)
  if (course.instructor_id !== instructorId) throw new UnauthorizedError('You do not own this course')
  return course
}

const assertInstructorOwnsModule = async (instructorId: string, moduleId: string): Promise<Module> => {
  const module = await getModuleOrThrow(moduleId)
  await assertInstructorOwnsCourse(instructorId, module.course_id)
  return module
}

const assertInstructorOwnsLesson = async (instructorId: string, lessonId: string): Promise<Lesson> => {
  const lesson = await getLessonOrThrow(lessonId)
  await assertInstructorOwnsModule(instructorId, lesson.module_id)
  return lesson
}

export const getCourseWithStructure = async (courseId: string): Promise<CourseWithStructure> => {
  const course = await getCourseOrThrow(courseId)
  const modules = await courseQueries.findModulesByCourseId(courseId)

  const modulesWithLessons: ModuleWithLessons[] = []
  for (const courseModule of modules) {
    const lessons = await lessonQueries.findLessonsByModuleId(courseModule.id)
    modulesWithLessons.push({ ...courseModule, lessons })
  }

  return { ...course, modules: modulesWithLessons }
}

export const getDownloadManifest = async (studentId: string, courseId: string): Promise<DownloadableLesson[]> => {
  await getCourseOrThrow(courseId)

  const enrollment = await enrollmentQueries.findEnrollmentByStudentAndCourse(studentId, courseId)
  if (!enrollment) throw new UnauthorizedError('Not enrolled in this course')

  return lessonQueries.findDownloadableLessonsForCourse(courseId)
}

export const updateCourse = async (
  instructorId: string,
  courseId: string,
  input: UpdateCourseInput
): Promise<Course> => {
  if (!input.title.trim()) throw new ValidationError('Course title is required')
  await assertInstructorOwnsCourse(instructorId, courseId)

  const updated = await courseQueries.updateCourse(courseId, input.title, input.description)
  if (!updated) throw new NotFoundError(`Course ${courseId} not found`)
  return updated
}

export const addModule = async (
  instructorId: string,
  courseId: string,
  input: AddModuleInput
): Promise<Module> => {
  if (!input.title.trim()) throw new ValidationError('Module title is required')
  await assertInstructorOwnsCourse(instructorId, courseId)

  const position = await courseQueries.findNextModulePosition(courseId)
  return courseQueries.addModule(courseId, input.title, position)
}

export const updateModule = async (
  instructorId: string,
  moduleId: string,
  input: UpdateModuleInput
): Promise<Module> => {
  if (!input.title.trim()) throw new ValidationError('Module title is required')
  await assertInstructorOwnsModule(instructorId, moduleId)

  const updated = await courseQueries.updateModule(moduleId, input.title, input.position)
  if (!updated) throw new NotFoundError(`Module ${moduleId} not found`)
  return updated
}

export const deleteModule = async (instructorId: string, moduleId: string): Promise<void> => {
  await assertInstructorOwnsModule(instructorId, moduleId)
  await courseQueries.softDeleteModule(moduleId)
}

export const addLesson = async (
  instructorId: string,
  moduleId: string,
  input: CreateLessonInput
): Promise<Lesson> => {
  if (!input.title.trim()) throw new ValidationError('Lesson title is required')
  await assertInstructorOwnsModule(instructorId, moduleId)

  const position = await lessonQueries.findNextLessonPosition(moduleId)
  return lessonQueries.addLesson(moduleId, input.title, input.contentUrl, position)
}

export const updateLesson = async (
  instructorId: string,
  lessonId: string,
  input: UpdateLessonInput
): Promise<Lesson> => {
  if (!input.title.trim()) throw new ValidationError('Lesson title is required')
  await assertInstructorOwnsLesson(instructorId, lessonId)

  const updated = await lessonQueries.updateLesson(lessonId, input.title, input.contentUrl, input.position)
  if (!updated) throw new NotFoundError(`Lesson ${lessonId} not found`)
  return updated
}

export const deleteLesson = async (instructorId: string, lessonId: string): Promise<void> => {
  await assertInstructorOwnsLesson(instructorId, lessonId)
  await lessonQueries.softDeleteLesson(lessonId)
}

export const bulkAddLessons = async (
  instructorId: string,
  moduleId: string,
  items: CreateLessonInput[]
): Promise<Lesson[]> => {
  if (items.length === 0) throw new ValidationError('At least one lesson is required')
  for (const item of items) {
    if (!item.title.trim()) throw new ValidationError('Lesson title is required')
  }
  await assertInstructorOwnsModule(instructorId, moduleId)

  const startPosition = await lessonQueries.findNextLessonPosition(moduleId)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const lessons: Lesson[] = []
    for (let i = 0; i < items.length; i++) {
      const lesson = await courseQueries.insertLesson(client, moduleId, items[i].title, items[i].contentUrl, startPosition + i)
      lessons.push(lesson)
    }

    await client.query('COMMIT')
    return lessons
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export const reorderLessons = async (
  instructorId: string,
  moduleId: string,
  orderedLessonIds: string[]
): Promise<Lesson[]> => {
  await assertInstructorOwnsModule(instructorId, moduleId)

  const existingIds = await lessonQueries.findLessonIdsByModuleId(moduleId)
  const existingSet = new Set(existingIds)
  const providedSet = new Set(orderedLessonIds)

  const isExactMatch =
    existingSet.size === providedSet.size && [...existingSet].every((id) => providedSet.has(id))
  if (!isExactMatch) {
    throw new ValidationError('Provided lesson IDs must exactly match the lessons in this module')
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    for (let i = 0; i < orderedLessonIds.length; i++) {
      await lessonQueries.setLessonPosition(client, orderedLessonIds[i], i)
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  return lessonQueries.findLessonsByModuleId(moduleId)
}
