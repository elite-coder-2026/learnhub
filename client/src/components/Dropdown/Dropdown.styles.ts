import styled from 'styled-components'

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
`

export const Wrapper = styled.div`
  position: relative;
`

export const Trigger = styled.button<{ $isOpen: boolean; $hasError: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ $isOpen, $hasError, theme }) => {
      if ($hasError) return theme.colors.error
      if ($isOpen) return theme.colors.primary
      return theme.colors.border
    }};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
`

export const Menu = styled.ul`
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
  max-height: 240px;
  overflow-y: auto;
  z-index: 10;
`

export const Item = styled.li<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.primary : theme.colors.text)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`

export const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`
