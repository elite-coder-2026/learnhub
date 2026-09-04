import { API_URL } from '../config/api'
import type { RegisterRequest, RegisterResult } from '../types/auth'

interface ApiErrorBody {
  error?: string
}

interface RegisterEnvelope {
  data: RegisterResult
}

export async function registerUser(
  payload: RegisterRequest,
): Promise<RegisterResult> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = `Registration failed (${response.status})`
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.error) message = body.error
    } catch {
      message = `Registration failed (${response.status})`
    }
    throw new Error(message)
  }

  const body = (await response.json()) as RegisterEnvelope
  return body.data
}
