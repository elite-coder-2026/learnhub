import styled from 'styled-components'
import ReactEChartsCore from 'echarts-for-react/esm/core'

export const Container = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`

export const Chart = styled(ReactEChartsCore)`
  && {
    height: ${({ theme }) => theme.sizes.chart} !important;
  }
`
