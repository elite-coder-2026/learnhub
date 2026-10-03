import styled from 'styled-components'

export const Container = styled.div`
  padding: ${({ theme }) => theme.spacing[1]} 0;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.full};
`

export const Track = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.sizes.progressBar};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.full};
`

export const Fill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.full};
  transition: width ${({ theme }) => theme.transitions.normal};
`
