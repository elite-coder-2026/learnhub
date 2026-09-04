import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { registerUser } from '../services/authService'
import type { RegisterRequest, RegisterResult } from '../types/auth'

export function useRegister(): UseMutationResult<
  RegisterResult,
  Error,
  RegisterRequest
> {
  return useMutation<RegisterResult, Error, RegisterRequest>({
    mutationFn: registerUser,
  })
}
