import styled from 'styled-components'
import { Link } from 'react-router-dom'
import type { AppTheme } from '../../theme'

const thumbnailGradients: ((theme: AppTheme) => string)[] = [
  (theme) => `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`,
  (theme) => `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary})`,
  (theme) => `linear-gradient(135deg, ${theme.colors.warning}, ${theme.colors.accent})`,
  (theme) => `linear-gradient(135deg, ${theme.colors.primaryHover}, ${theme.colors.text})`,
]

export const Container = styled(Link)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  color: inherit;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform ${({ theme }) => theme.transitions.normal},
    box-shadow ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-${({ theme }) => theme.spacing[1]});
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`

export const Thumbnail = styled.div<{ $variant: number }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.sizes.thumbnail};
  min-height: ${({ theme }) => theme.sizes.thumbnail};
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ $variant, theme }) => thumbnailGradients[$variant](theme)};
  border-radius: ${({ theme }) => theme.radii.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`

export const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  min-width: 0;
`

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Meta = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: auto;
`

export const LessonCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const ContinueButton = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: background ${({ theme }) => theme.transitions.fast};

  ${Container}:hover & {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`
