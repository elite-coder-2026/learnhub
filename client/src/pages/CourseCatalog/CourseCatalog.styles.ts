import styled from 'styled-components'

export const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const LoadMoreRow = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
`
