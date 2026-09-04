import type { ButtonHTMLAttributes } from 'react'
import * as S from './Button.styles'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  children,
  ...rest
}) => (
  <S.StyledButton
    type={type}
    $variant={variant}
    $size={size}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    {...rest}
  >
    {isLoading && <S.Spinner aria-hidden="true" />}
    <S.Label $isLoading={isLoading}>{children}</S.Label>
  </S.StyledButton>
)

export default Button
