import styled, { keyframes } from 'styled-components'
import type { AppTheme } from '../../theme'

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

export const Block = styled.div<{
  $width: string
  $height: string
  $radius: keyof AppTheme['borderRadius']
}>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: ${({ $radius, theme }) => theme.borderRadius[$radius]};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.border} 25%,
    ${({ theme }) => theme.colors.background} 37%,
    ${({ theme }) => theme.colors.border} 63%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`
