export interface Notification {
  id: string
  user_id: string
  action_id: string | null
  type: string
  title: string
  message: string | null
  content_label: string | null
  content_url: string | null
  quote: string | null
  read_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface CreateNotificationInput {
  userId: string
  actionId: string | null
  type: string
  title: string
  message: string | null
  contentLabel: string | null
  contentUrl: string | null
  quote: string | null
}
