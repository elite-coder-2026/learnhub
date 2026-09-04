import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as S from './Register.styles'
import { useRegister } from '../../hooks/useRegister'
import type { UserRole } from '../../types/auth'

interface RegisterProps {
  onSuccess?: () => void
  loginHref?: string
}

interface RoleOption {
  value: UserRole
  label: string
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  userRole: UserRole
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const ROLE_OPTIONS: readonly RoleOption[] = [
  { value: 'student', label: 'Student' },
  { value: 'instructor', label: 'Instructor' },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  userRole: 'student',
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}

  if (form.firstName.trim().length < 1) {
    errors.firstName = 'Enter your first name'
  }
  if (form.lastName.trim().length < 1) {
    errors.lastName = 'Enter your last name'
  }
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

const Register: React.FC<RegisterProps> = ({
  onSuccess,
  loginHref = '/login',
}) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false)

  const roleRef = useRef<HTMLDivElement>(null)
  const register = useRegister()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (register.isSuccess && onSuccess) {
      onSuccess()
    }
  }, [register.isSuccess, onSuccess])

  const selectedRoleLabel = useMemo<string>(
    () =>
      ROLE_OPTIONS.find((option) => option.value === form.userRole)?.label ??
      'Select a role',
    [form.userRole],
  )

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ): void => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setSubmitted(true)

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    register.mutate({
      email: form.email.trim(),
      password: form.password,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      userRole: form.userRole,
    })
  }

  const liveErrors = submitted ? validate(form) : errors

  return (
    <S.Container>
      <S.Card>
        <S.Title>Create your account</S.Title>
        <S.Subtitle>Start learning or teaching on LearnHub.</S.Subtitle>

        {register.isError && (
          <S.Message $variant="error" role="alert">
            {register.error.message}
          </S.Message>
        )}

        {register.isSuccess ? (
          <S.Message $variant="success" role="status">
            Account created. You can now sign in.
          </S.Message>
        ) : (
          <S.Form onSubmit={handleSubmit} noValidate>
            <S.Field>
              <S.Label htmlFor="register-first-name">First name</S.Label>
              <S.Input
                id="register-first-name"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                $hasError={Boolean(liveErrors.firstName)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField('firstName', e.target.value)
                }
              />
              {liveErrors.firstName && (
                <S.FieldError>{liveErrors.firstName}</S.FieldError>
              )}
            </S.Field>

            <S.Field>
              <S.Label htmlFor="register-last-name">Last name</S.Label>
              <S.Input
                id="register-last-name"
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                $hasError={Boolean(liveErrors.lastName)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField('lastName', e.target.value)
                }
              />
              {liveErrors.lastName && (
                <S.FieldError>{liveErrors.lastName}</S.FieldError>
              )}
            </S.Field>

            <S.Field>
              <S.Label htmlFor="register-email">Email</S.Label>
              <S.Input
                id="register-email"
                type="email"
                autoComplete="email"
                value={form.email}
                $hasError={Boolean(liveErrors.email)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField('email', e.target.value)
                }
              />
              {liveErrors.email && (
                <S.FieldError>{liveErrors.email}</S.FieldError>
              )}
            </S.Field>

            <S.Field>
              <S.Label htmlFor="register-password">Password</S.Label>
              <S.Input
                id="register-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                $hasError={Boolean(liveErrors.password)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField('password', e.target.value)
                }
              />
              {liveErrors.password && (
                <S.FieldError>{liveErrors.password}</S.FieldError>
              )}
            </S.Field>

            <S.Field>
              <S.Label htmlFor="register-confirm">Confirm password</S.Label>
              <S.Input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                $hasError={Boolean(liveErrors.confirmPassword)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateField('confirmPassword', e.target.value)
                }
              />
              {liveErrors.confirmPassword && (
                <S.FieldError>{liveErrors.confirmPassword}</S.FieldError>
              )}
            </S.Field>

            <S.Field>
              <S.Label as="span">I am joining as</S.Label>
              <S.DropdownWrapper ref={roleRef}>
                <S.DropdownTrigger
                  type="button"
                  $isOpen={isRoleOpen}
                  aria-haspopup="listbox"
                  aria-expanded={isRoleOpen}
                  onClick={() => setIsRoleOpen((open) => !open)}
                >
                  {selectedRoleLabel}
                  <span aria-hidden="true">{isRoleOpen ? '▲' : '▼'}</span>
                </S.DropdownTrigger>
                {isRoleOpen && (
                  <S.DropdownMenu role="listbox">
                    {ROLE_OPTIONS.map((option) => (
                      <S.DropdownItem
                        key={option.value}
                        role="option"
                        aria-selected={form.userRole === option.value}
                        $isSelected={form.userRole === option.value}
                        onClick={() => {
                          updateField('userRole', option.value)
                          setIsRoleOpen(false)
                        }}
                      >
                        {option.label}
                      </S.DropdownItem>
                    ))}
                  </S.DropdownMenu>
                )}
              </S.DropdownWrapper>
            </S.Field>

            <S.SubmitButton type="submit" disabled={register.isPending}>
              {register.isPending ? 'Creating account…' : 'Create account'}
            </S.SubmitButton>
          </S.Form>
        )}

        <S.FooterText>
          Already have an account?{' '}
          <S.FooterLink href={loginHref}>Sign in</S.FooterLink>
        </S.FooterText>
      </S.Card>
    </S.Container>
  )
}

export default Register
