import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import type { LessonState } from './index'

export const Container = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

export const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const CourseTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`

export const PanelMeta = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`

export const SectionHeader = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]};
  font-family: inherit;
  text-align: left;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bg};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const Chevron = styled.span<{ $isCollapsed: boolean }>`
  display: inline-flex;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  transform: rotate(${({ $isCollapsed }) => ($isCollapsed ? '-90deg' : '0deg')});
  transition: transform ${({ theme }) => theme.transitions.fast};
`

export const SectionTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`

export const SectionCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  margin: 0;
  padding: 0;
  list-style: none;
`

const rowStyles = css<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.primary : theme.colors.text)};
  font-weight: ${({ $isActive, theme }) => ($isActive ? theme.fontWeights.medium : theme.fontWeights.regular)};
  text-decoration: none;
  background: ${({ $isActive, theme }) => ($isActive ? theme.colors.primarySoft : 'transparent')};
  border-radius: ${({ theme }) => theme.radii.sm};
  box-shadow: ${({ $isActive, theme }) => ($isActive ? `inset 3px 0 0 ${theme.colors.primary}` : 'none')};
  transition: background ${({ theme }) => theme.transitions.fast};
`

export const RowLink = styled(Link)<{ $isActive: boolean }>`
  ${rowStyles}

  &:hover {
    background: ${({ $isActive, theme }) => ($isActive ? theme.colors.primarySoft : theme.colors.bg)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const StaticRow = styled.div<{ $isActive: boolean }>`
  ${rowStyles}
`

export const StateIcon = styled.span<{ $state: LessonState }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.fontSizes.lg};
  height: ${({ theme }) => theme.fontSizes.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.full};
  ${({ $state, theme }) => {
    if ($state === 'completed') {
      return `background: ${theme.colors.success}; border: 2px solid ${theme.colors.success};`
    }
    if ($state === 'current') return `border: 2px solid ${theme.colors.primary};`
    return `border: 2px solid ${theme.colors.borderStrong};`
  }}
`

export const LessonNumber = styled.span`
  flex-shrink: 0;
  min-width: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: right;
`

export const LessonTitle = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const TypeIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`
