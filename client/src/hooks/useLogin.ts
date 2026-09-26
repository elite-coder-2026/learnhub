import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { loginUser } from '../services/authService'
import type { LoginRequest, LoginResult } from '../types/auth'

export function useLogin(): UseMutationResult<
  LoginResult,
  Error,
  LoginRequest
> {
  return useMutation<LoginResult, Error, LoginRequest>({
    mutationFn: loginUser,
  })
}
