import styled from 'styled-components'

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  min-width: ${({ theme }) => theme.sizes.dropdown};
`

export const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
`

export const Wrapper = styled.div`
  position: relative;
`

export const Trigger = styled.button<{ $isOpen: boolean; $hasError: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ $isOpen, $hasError, theme }) => {
      if ($hasError) return theme.colors.error
      if ($isOpen) return theme.colors.primary
      return theme.colors.border
    }};
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const TriggerText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Chevron = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
  transition: transform ${({ theme }) => theme.transitions.fast};
`

export const Menu = styled.ul`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing[1]});
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  max-height: ${({ theme }) => theme.sizes.dropdownMenuMax};
  margin: 0;
  padding: ${({ theme }) => theme.spacing[1]};
  overflow-y: auto;
  list-style: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
`

export const Item = styled.li<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ $isSelected, theme }) =>
    $isSelected ? theme.fontWeights.semibold : theme.fontWeights.regular};
  color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.primary : theme.colors.text)};
  background: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.primarySoft : 'transparent')};
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`

export const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
`
