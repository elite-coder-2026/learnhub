import styled from 'styled-components'
import type { AppTheme } from '../../theme'
import type { ToastVariant } from './index'

export const Container = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 200;
`

const variantColor: Record<ToastVariant, (theme: AppTheme) => string> = {
  success: (theme) => theme.colors.success,
  error: (theme) => theme.colors.error,
  info: (theme) => theme.colors.primary,
}

export const ToastItem = styled.div<{ $variant: ToastVariant }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  min-width: 240px;
  max-width: 360px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ $variant, theme }) => variantColor[$variant](theme)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

export const Message = styled.span`
  flex: 1;
`

export const DismissButton = styled.button`
  padding: 0;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1;
`
