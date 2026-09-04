import type { ReactNode } from 'react'
import * as S from './PageHeader.styles'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => (
  <S.Header>
    <S.TitleGroup>
      <S.Title>{title}</S.Title>
      {description && <S.Description>{description}</S.Description>}
    </S.TitleGroup>
    {actions && <S.Actions>{actions}</S.Actions>}
  </S.Header>
)

export default PageHeader
