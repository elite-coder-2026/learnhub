import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import { useTheme } from 'styled-components'
import type { AppTheme } from '../../theme'
import * as S from './ActivityChart.styles'

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

export interface ActivityDay {
  date: string
  label: string
  lessonsCompleted: number
}

interface ActivityChartProps {
  days: ActivityDay[]
}

const px = (token: string): number => Number.parseInt(token, 10)

const buildOption = (days: ActivityDay[], theme: AppTheme): EChartsOption => ({
  grid: {
    top: px(theme.spacing[2]),
    right: px(theme.spacing[2]),
    bottom: px(theme.spacing[6]),
    left: px(theme.spacing[8]),
  },
  tooltip: { trigger: 'axis', axisPointer: { type: 'none' } },
  xAxis: {
    type: 'category',
    data: days.map((day) => day.label),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: theme.colors.textMuted },
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
    splitLine: { show: false },
    axisLabel: { color: theme.colors.textMuted },
  },
  series: [
    {
      type: 'bar',
      name: 'Lessons completed',
      data: days.map((day) => day.lessonsCompleted),
      barMaxWidth: px(theme.spacing[8]),
      itemStyle: {
        color: theme.colors.primary,
        borderRadius: [px(theme.radii.sm), px(theme.radii.sm), 0, 0],
      },
      emphasis: { itemStyle: { color: theme.colors.primaryHover } },
    },
  ],
})

const ActivityChart: React.FC<ActivityChartProps> = ({ days }) => {
  const theme = useTheme()

  return (
    <S.Container>
      <S.Chart echarts={echarts} option={buildOption(days, theme)} />
    </S.Container>
  )
}

export default ActivityChart
