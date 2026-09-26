export interface PaginatedResponse<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

export interface CursorParams {
  cursor?: string | null
  limit?: number
}
