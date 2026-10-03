import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.contentMax};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`
