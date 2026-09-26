import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Container = styled.nav`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

export const ModuleTitle = styled.h4`
  margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};

  &:first-child {
    margin-top: 0;
  }
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const rowStyles = `
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
`

export const StaticRow = styled.div`
  ${rowStyles}
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
`

export const RowLink = styled(Link)<{ $isActive: boolean }>`
  ${rowStyles}
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.text};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.background : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`

export const Marker = styled.span<{ $completed: boolean }>`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 50%;
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.surface : theme.colors.textMuted};
  background: ${({ $completed, theme }) =>
    $completed ? theme.colors.success : 'transparent'};
  border: 1px solid
    ${({ $completed, theme }) =>
      $completed ? theme.colors.success : theme.colors.border};
`

export const LessonTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
