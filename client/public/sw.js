const CACHE_PREFIX = 'learnhub-course-'
const courseCacheName = (courseId) => `${CACHE_PREFIX}${courseId}`

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

const postToAllClients = async (message) => {
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  for (const client of clients) {
    client.postMessage(message)
  }
}

const cacheCourse = async (courseId, apiUrl, token) => {
  const manifestResponse = await fetch(`${apiUrl}/courses/${courseId}/download-manifest`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!manifestResponse.ok) {
    throw new Error(`Failed to load download manifest (${manifestResponse.status})`)
  }

  const { data: lessons } = await manifestResponse.json()
  const downloadable = lessons.filter((lesson) => !!lesson.content_url)

  const cache = await caches.open(courseCacheName(courseId))
  let completed = 0

  for (const lesson of downloadable) {
    try {
      const contentResponse = await fetch(lesson.content_url)
      if (contentResponse.ok) {
        await cache.put(lesson.content_url, contentResponse.clone())
      }
    } finally {
      completed += 1
      await postToAllClients({
        type: 'DOWNLOAD_PROGRESS',
        courseId,
        completed,
        total: downloadable.length
      })
    }
  }

  await postToAllClients({ type: 'DOWNLOAD_COMPLETE', courseId })
}

const invalidateLesson = async (contentUrl) => {
  const cacheNames = await caches.keys()
  const courseCaches = cacheNames.filter((name) => name.startsWith(CACHE_PREFIX))
  await Promise.all(courseCaches.map((name) => caches.open(name).then((cache) => cache.delete(contentUrl))))
}

const removeCourse = async (courseId) => {
  await caches.delete(courseCacheName(courseId))
}

self.addEventListener('message', (event) => {
  const message = event.data
  if (!message || typeof message.type !== 'string') return

  if (message.type === 'CACHE_COURSE') {
    event.waitUntil(
      cacheCourse(message.courseId, message.apiUrl, message.token).catch((error) =>
        postToAllClients({ type: 'DOWNLOAD_ERROR', courseId: message.courseId, error: error.message })
      )
    )
    return
  }

  if (message.type === 'INVALIDATE_LESSON') {
    event.waitUntil(invalidateLesson(message.contentUrl))
    return
  }

  if (message.type === 'REMOVE_COURSE') {
    event.waitUntil(removeCourse(message.courseId))
  }
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request)
      if (cached) return cached
      throw new Error('Offline and no cached response available')
    })
  )
})
