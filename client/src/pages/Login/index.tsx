import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from './Login.styles'
import { useLogin } from '../../hooks/useLogin'
import { useAuth } from '../../hooks/useAuth'

interface LoginProps {
  redirectTo?: string
  registerHref?: string
}

interface FormState {
  email: string
  password: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL_FORM: FormState = {
  email: '',
  password: '',
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}

  if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (form.password.length < 1) {
    errors.password = 'Enter your password'
  }

  return errors
}

const Login: React.FC<LoginProps> = ({
  redirectTo = '/dashboard',
  registerHref = '/register',
}) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState<boolean>(false)

  const login = useLogin()
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (login.isSuccess) {
      auth.login(login.data.token)
      navigate(redirectTo, { replace: true })
    }
  }, [login.isSuccess, login.data, auth, navigate, redirectTo])

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

    login.mutate({
      email: form.email.trim(),
      password: form.password,
    })
  }

  const liveErrors = submitted ? validate(form) : errors

  return (
    <S.Container>
      <S.Card>
        <S.Title>Sign in</S.Title>
        <S.Subtitle>Welcome back to LearnHub.</S.Subtitle>

        {login.isError && (
          <S.Message $variant="error" role="alert">
            {login.error.message}
          </S.Message>
        )}

        {login.isSuccess ? (
          <S.Message $variant="success" role="status">
            Signed in. Redirecting…
          </S.Message>
        ) : (
          <S.Form onSubmit={handleSubmit} noValidate>
            <S.Field>
              <S.Label htmlFor="login-email">Email</S.Label>
              <S.Input
                id="login-email"
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
              <S.Label htmlFor="login-password">Password</S.Label>
              <S.Input
                id="login-password"
                type="password"
                autoComplete="current-password"
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

            <S.SubmitButton type="submit" disabled={login.isPending}>
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </S.SubmitButton>
          </S.Form>
        )}

        <S.FooterText>
          Need an account?{' '}
          <S.FooterLink href={registerHref}>Create one</S.FooterLink>
        </S.FooterText>
      </S.Card>
    </S.Container>
  )
}

export default Login
