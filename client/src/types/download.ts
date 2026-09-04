export interface DownloadProgressMessage {
  type: 'DOWNLOAD_PROGRESS'
  courseId: string
  completed: number
  total: number
}

export interface DownloadCompleteMessage {
  type: 'DOWNLOAD_COMPLETE'
  courseId: string
}

export interface DownloadErrorMessage {
  type: 'DOWNLOAD_ERROR'
  courseId: string
  error: string
}

export type ServiceWorkerDownloadMessage =
  | DownloadProgressMessage
  | DownloadCompleteMessage
  | DownloadErrorMessage
