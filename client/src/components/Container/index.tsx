import React from 'react'
import * as S from './Container.styles'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

const Container: React.FC<ContainerProps> = ({ children, className }) => (
  <S.Container className={className}>{children}</S.Container>
)

export default Container
