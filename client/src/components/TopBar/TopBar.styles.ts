import styled from 'styled-components'

export const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const ToggleButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  background: none;
  border: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`

export const Brand = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto;
`

export const RoleText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: capitalize;
`
