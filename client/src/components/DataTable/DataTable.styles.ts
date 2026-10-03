import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`

export const Scroll = styled.div`
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

export const HeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const Cell = styled.td`
  padding: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text};
  vertical-align: middle;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const Empty = styled.p`
  padding: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`

export const Footer = styled.div`
  display: flex;
  justify-content: center;
`
