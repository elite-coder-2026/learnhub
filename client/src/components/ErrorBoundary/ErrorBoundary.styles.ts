import styled from 'styled-components'

export const Container = styled.div`
  max-width: 480px;
  margin: ${({ theme }) => theme.spacing.xl} auto;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
  text-align: center;
`

export const Title = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
`

export const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`
