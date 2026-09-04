import * as S from './InlineError.styles'

interface InlineErrorProps {
  message: string
}

const InlineError: React.FC<InlineErrorProps> = ({ message }) => (
  <S.Container role="alert">{message}</S.Container>
)

export default InlineError
