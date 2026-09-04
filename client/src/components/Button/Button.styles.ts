import styled, { keyframes } from 'styled-components'
import type { AppTheme } from '../../theme'
import type { ButtonSize, ButtonVariant } from './index'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const sizePadding: Record<ButtonSize, (theme: AppTheme) => string> = {
  sm: (theme) => `${theme.spacing.xs} ${theme.spacing.sm}`,
  md: (theme) => `${theme.spacing.sm} ${theme.spacing.md}`,
  lg: (theme) => `${theme.spacing.md} ${theme.spacing.lg}`,
}

const sizeFontSize: Record<ButtonSize, (theme: AppTheme) => string> = {
  sm: (theme) => theme.fontSizes.sm,
  md: (theme) => theme.fontSizes.md,
  lg: (theme) => theme.fontSizes.lg,
}

const variantStyles: Record<ButtonVariant, (theme: AppTheme) => string> = {
  primary: (theme) => `
    color: ${theme.colors.surface};
    background: ${theme.colors.primary};
    border: 1px solid ${theme.colors.primary};

    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
    }
  `,
  secondary: (theme) => `
    color: ${theme.colors.text};
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};

    &:hover:not(:disabled) {
      background: ${theme.colors.background};
    }
  `,
  ghost: (theme) => `
    color: ${theme.colors.primary};
    background: transparent;
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${theme.colors.background};
    }
  `,
  danger: (theme) => `
    color: ${theme.colors.surface};
    background: ${theme.colors.error};
    border: 1px solid ${theme.colors.error};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
}

export const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ $size, theme }) => sizePadding[$size](theme)};
  font-size: ${({ $size, theme }) => sizeFontSize[$size](theme)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  ${({ $variant, theme }) => variantStyles[$variant](theme)}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const Spinner = styled.span`
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`

export const Label = styled.span<{ $isLoading: boolean }>`
  visibility: ${({ $isLoading }) => ($isLoading ? 'hidden' : 'visible')};
`
