import { API_URL } from '../config/api'
import type {
  LoginRequest,
  LoginResult,
  RegisterRequest,
  RegisterResult,
} from '../types/auth'

interface ApiErrorBody {
  error?: string
}

interface RegisterEnvelope {
  data: RegisterResult
}

interface LoginEnvelope {
  data: LoginResult
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

export async function loginUser(payload: LoginRequest): Promise<LoginResult> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = `Login failed (${response.status})`
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.error) message = body.error
    } catch {
      message = `Login failed (${response.status})`
    }
    throw new Error(message)
  }

  const body = (await response.json()) as LoginEnvelope
  return body.data
}
