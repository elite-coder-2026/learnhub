import { API_URL } from './config/api'
import type { ServiceWorkerDownloadMessage } from './types/download'

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing
          if (!installingWorker) return

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.info('New content is available; it will be used on next reload.')
            }
          })
        })
      })
      .catch((error: unknown) => {
        console.error('Service worker registration failed:', error)
      })
  })
}

async function getReadyController(): Promise<ServiceWorker | null> {
  if (!('serviceWorker' in navigator)) return null
  const registration = await navigator.serviceWorker.ready
  return registration.active
}

export async function downloadCourseForOffline(courseId: string, token: string): Promise<void> {
  const controller = await getReadyController()
  if (!controller) throw new Error('Service worker is not available')

  controller.postMessage({ type: 'CACHE_COURSE', courseId, apiUrl: API_URL, token })
}

export async function removeCourseDownload(courseId: string): Promise<void> {
  const controller = await getReadyController()
  if (!controller) throw new Error('Service worker is not available')

  controller.postMessage({ type: 'REMOVE_COURSE', courseId })
}

export async function invalidateLessonCache(contentUrl: string): Promise<void> {
  const controller = await getReadyController()
  if (!controller) throw new Error('Service worker is not available')

  controller.postMessage({ type: 'INVALIDATE_LESSON', contentUrl })
}

export function subscribeToDownloadEvents(
  callback: (message: ServiceWorkerDownloadMessage) => void
): () => void {
  if (!('serviceWorker' in navigator)) return () => {}

  const listener = (event: MessageEvent<ServiceWorkerDownloadMessage>): void => {
    callback(event.data)
  }

  navigator.serviceWorker.addEventListener('message', listener)
  return () => navigator.serviceWorker.removeEventListener('message', listener)
}
