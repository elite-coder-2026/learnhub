import styled from 'styled-components'
import type { AppTheme } from '../../theme'
import type { StatusTone } from './index'

const toneColor: Record<StatusTone, (theme: AppTheme) => string> = {
  neutral: (theme) => theme.colors.textMuted,
  primary: (theme) => theme.colors.primary,
  success: (theme) => theme.colors.success,
  warning: (theme) => theme.colors.warning,
  danger: (theme) => theme.colors.error,
}

export const Badge = styled.span<{ $tone: StatusTone }>`
  display: inline-flex;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ $tone, theme }) => toneColor[$tone](theme)};
  text-transform: capitalize;
  white-space: nowrap;
  border: 1px solid ${({ $tone, theme }) => toneColor[$tone](theme)};
  border-radius: ${({ theme }) => theme.radii.full};
`
