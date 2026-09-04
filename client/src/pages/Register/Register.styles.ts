import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
`

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

export const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text};
`

export const Subtitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
`

export const Input = styled.input<{ $hasError: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  outline: none;

  &:focus {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
  }
`

export const FieldError = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`

export const DropdownWrapper = styled.div`
  position: relative;
`

export const DropdownTrigger = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ $isOpen, theme }) =>
      $isOpen ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
`

export const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs});
  left: 0;
  right: 0;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.xs};
  list-style: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  z-index: 10;
`

export const DropdownItem = styled.li<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.primary : theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`

export const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const Message = styled.p<{ $variant: 'error' | 'success' }>`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ $variant, theme }) =>
    $variant === 'error' ? theme.colors.error : theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`

export const FooterText = styled.p`
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`

export const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
