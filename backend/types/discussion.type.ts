export interface DiscussionPost {
  id: string
  lesson_id: string
  author_id: string
  body: string
  created_at: Date
  updated_at: Date
}

export interface DiscussionPostWithAuthor {
  id: string
  lesson_id: string
  author_id: string
  author_first_name: string
  author_last_name: string
  author_role: 'student' | 'instructor' | 'admin'
  body: string
  created_at: Date
}

export interface CreateDiscussionPostInput {
  body: string
}
