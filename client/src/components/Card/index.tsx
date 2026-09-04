import type { ReactNode } from 'react'
import * as S from './Card.styles'

interface CardProps {
  children: ReactNode
}

const Card: React.FC<CardProps> = ({ children }) => <S.Container>{children}</S.Container>

export default Card
