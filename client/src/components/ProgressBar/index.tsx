import * as S from './ProgressBar.styles'

interface ProgressBarProps {
  percent: number
  label: string
}

const clampPercent = (percent: number): number => Math.min(100, Math.max(0, percent))

const ProgressBar: React.FC<ProgressBarProps> = ({ percent, label }) => {
  const value = clampPercent(percent)

  return (
    <S.Container>
      <S.Track
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <S.Fill $percent={value} />
      </S.Track>
    </S.Container>
  )
}

export default ProgressBar
