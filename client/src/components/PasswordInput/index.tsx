import { useId, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import * as S from './PasswordInput.styles'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  hint?: string
  error?: string
  showStrengthMeter?: boolean
}

interface PasswordStrength {
  label: string
  score: 0 | 1 | 2 | 3
}

function getPasswordStrength(password: string): PasswordStrength | null {
  if (password.length === 0) return null

  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  const clampedScore = Math.min(score, 3) as 0 | 1 | 2 | 3
  const labels: Record<0 | 1 | 2 | 3, string> = {
    0: 'Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
  }

  return { label: labels[clampedScore], score: clampedScore }
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  hint,
  error,
  showStrengthMeter = false,
  id,
  value,
  ...rest
}) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [isVisible, setIsVisible] = useState(false)
  const hasError = Boolean(error)
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  const strength =
    showStrengthMeter && typeof value === 'string' ? getPasswordStrength(value) : null

  return (
    <S.Field>
      <S.Label htmlFor={inputId}>{label}</S.Label>
      <S.InputWrapper>
        <S.StyledInput
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          $hasError={hasError}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          value={value}
          {...rest}
        />
        <S.ToggleButton
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? 'Hide' : 'Show'}
        </S.ToggleButton>
      </S.InputWrapper>
      {strength && (
        <S.StrengthMeter>
          <S.StrengthTrack>
            <S.StrengthBar $score={strength.score} />
          </S.StrengthTrack>
          <S.StrengthLabel>{strength.label}</S.StrengthLabel>
        </S.StrengthMeter>
      )}
      {error && (
        <S.ErrorText id={`${inputId}-error`} role="alert">
          {error}
        </S.ErrorText>
      )}
      {!error && hint && <S.HintText id={`${inputId}-hint`}>{hint}</S.HintText>}
    </S.Field>
  )
}

export default PasswordInput
