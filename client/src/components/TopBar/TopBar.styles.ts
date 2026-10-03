import styled from 'styled-components'

export const Bar = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  min-height: ${({ theme }) => theme.sizes.topBar};
  padding: 0 ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing[4]};
    gap: ${({ theme }) => theme.spacing[2]};
  }
`

export const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

export const Title = styled.h1`
  min-width: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const UserArea = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-left: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing[2]};
  }
`

export const Avatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.sizes.avatar};
  height: ${({ theme }) => theme.sizes.avatar};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radii.full};
`

export const RoleBadge = styled.span`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: capitalize;
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radii.full};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`
