import * as courseQueries from '../queries/course.query'
import * as wishlistQueries from '../queries/wishlist.query'
import { WishlistItem, WishlistCourse } from '../types/wishlist.type'
import { PaginatedResponse } from '../types/progress.type'
import { NotFoundError, ValidationError } from '../utils/errors'

export const addToWishlist = async (studentId: string, courseId: string): Promise<WishlistItem> => {
  const course = await courseQueries.findCourseById(courseId)
  if (!course) throw new NotFoundError(`Course ${courseId} not found`)

  const existing = await wishlistQueries.findWishlistItemByStudentAndCourse(studentId, courseId)
  if (existing) throw new ValidationError('Course already in wishlist')

  return wishlistQueries.insertWishlistItem(studentId, courseId)
}

export const removeFromWishlist = async (studentId: string, courseId: string): Promise<void> => {
  const existing = await wishlistQueries.findWishlistItemByStudentAndCourse(studentId, courseId)
  if (!existing) throw new NotFoundError(`Course ${courseId} not found in wishlist`)

  await wishlistQueries.softDeleteWishlistItem(existing.id)
}

export const getWishlist = async (
  studentId: string,
  cursor: string | null,
  limit: number
): Promise<PaginatedResponse<WishlistCourse>> => {
  const rows = await wishlistQueries.findWishlistForStudent(studentId, cursor, limit + 1)
  const hasMore = rows.length > limit
  const data = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? data[data.length - 1].wishlist_item_id : null
  return { data, nextCursor, hasMore }
}
