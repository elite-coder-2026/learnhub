import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import * as S from './Input.styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
}

const Input: React.FC<InputProps> = ({ label, hint, error, id, ...rest }) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hasError = Boolean(error)
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <S.Field>
      <S.Label htmlFor={inputId}>{label}</S.Label>
      <S.StyledInput
        id={inputId}
        $hasError={hasError}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        {...rest}
      />
      {error && (
        <S.ErrorText id={`${inputId}-error`} role="alert">
          {error}
        </S.ErrorText>
      )}
      {!error && hint && <S.HintText id={`${inputId}-hint`}>{hint}</S.HintText>}
    </S.Field>
  )
}

export default Input
