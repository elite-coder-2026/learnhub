export interface WishlistItem {
  id: string
  student_id: string
  course_id: string
  created_at: Date
  updated_at: Date
}

export interface WishlistCourse {
  wishlist_item_id: string
  course_id: string
  title: string
  description: string | null
  category: string | null
  instructor_id: string
  added_at: Date
}
