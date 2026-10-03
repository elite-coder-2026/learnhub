import { API_URL } from '../config/api'

interface ApiErrorBody {
  error?: string
}

async function request<T>(
  path: string,
  init: RequestInit,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {}
  if (init.body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.error) message = body.error
    } catch {
      message = `Request failed (${response.status})`
    }
    throw new Error(message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export function apiGetRaw<T>(path: string, token?: string | null): Promise<T> {
  return request<T>(path, { method: 'GET' }, token)
}

export async function apiGet<T>(path: string, token?: string | null): Promise<T> {
  const body = await request<{ data: T }>(path, { method: 'GET' }, token)
  return body.data
}

export async function apiPost<T>(
  path: string,
  payload: unknown,
  token?: string | null,
): Promise<T> {
  const body = await request<{ data: T }>(
    path,
    {
      method: 'POST',
      body: payload === undefined ? undefined : JSON.stringify(payload),
    },
    token,
  )
  return body.data
}

export function apiDelete(path: string, token?: string | null): Promise<void> {
  return request<void>(path, { method: 'DELETE' }, token)
}

export const apiGetBlob = async (path: string, token: string): Promise<Blob> => {
  const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.error) message = body.error
    } catch {
      message = `Request failed (${response.status})`
    }
    throw new Error(message)
  }
  return response.blob()
}

export const apiPut = async <T>(path: string, payload: unknown, token: string): Promise<T> => {
  const body = await request<{ data: T }>(
    path,
    { method: 'PUT', body: payload === undefined ? undefined : JSON.stringify(payload) },
    token,
  )
  return body.data
}
