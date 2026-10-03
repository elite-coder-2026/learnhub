import CheckIcon from '@mui/icons-material/Check'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import ProgressBar from '../ProgressBar'
import { FEATURE_CARDS, type FeatureCard, type FeatureWidget } from './features.config'
import * as S from './FeaturesSection.styles'

const Widget: React.FC<{ widget: FeatureWidget }> = ({ widget }) => {
  if (widget.type === 'progress') {
    return (
      <S.ProgressWidget>
        <S.WidgetRow>
          <S.ProgressLabel>{widget.label}</S.ProgressLabel>
          <S.ProgressValue>{widget.percent}%</S.ProgressValue>
        </S.WidgetRow>
        <ProgressBar percent={widget.percent} label={widget.label} />
      </S.ProgressWidget>
    )
  }

  if (widget.type === 'stat') {
    return (
      <S.StatWidget>
        <S.StatText>
          <S.StatLabel>{widget.label}</S.StatLabel>
          <span>
            <S.StatValue>{widget.value}</S.StatValue> <S.StatUnit>{widget.unit}</S.StatUnit>
          </span>
        </S.StatText>
        <S.TrendPill>{widget.trend}</S.TrendPill>
      </S.StatWidget>
    )
  }

  return (
    <S.CredentialWidget>
      <S.CredentialTile aria-hidden="true">
        <VerifiedUserOutlinedIcon fontSize="inherit" />
      </S.CredentialTile>
      <S.StatText>
        <S.CredentialTitle>{widget.title}</S.CredentialTitle>
        <S.CredentialMeta>{widget.meta}</S.CredentialMeta>
      </S.StatText>
    </S.CredentialWidget>
  )
}

const Card: React.FC<{ card: FeatureCard }> = ({ card }) => {
  const isFeatured = card.featured === true
  const Icon = card.icon

  return (
    <S.Card $isFeatured={isFeatured} aria-labelledby={`feature-${card.id}-title`}>
      {card.badge && <S.Badge>{card.badge}</S.Badge>}
      <S.TopRow>
        <S.IconTile $isFeatured={isFeatured} aria-hidden="true">
          <Icon fontSize="inherit" />
        </S.IconTile>
        <S.Tag $isFeatured={isFeatured}>{card.tag}</S.Tag>
      </S.TopRow>
      <S.Title id={`feature-${card.id}-title`}>{card.title}</S.Title>
      <S.Description>{card.description}</S.Description>
      <S.Bullets>
        {card.bullets.map((bullet) => (
          <S.Bullet key={`${bullet.bold}${bullet.rest}`}>
            <S.CheckSlot aria-hidden="true">
              <CheckIcon fontSize="inherit" />
            </S.CheckSlot>
            <span>
              {bullet.bold && <S.BulletBold>{bullet.bold}</S.BulletBold>}
              {bullet.bold ? ` ${bullet.rest}` : bullet.rest}
            </span>
          </S.Bullet>
        ))}
      </S.Bullets>
      <S.WidgetArea>
        <Widget widget={card.widget} />
      </S.WidgetArea>
      <S.Footer>
        {card.cta.variant === 'button' ? (
          <S.CtaButton to={card.cta.href}>
            {card.cta.label}
            <ArrowForwardIcon fontSize="inherit" />
          </S.CtaButton>
        ) : (
          <S.CtaLink to={card.cta.href}>
            {card.cta.label}
            <ArrowForwardIcon fontSize="inherit" />
          </S.CtaLink>
        )}
      </S.Footer>
    </S.Card>
  )
}

const FeaturesSection: React.FC = () => (
  <S.Section aria-label="LearnHub features">
    <S.Glow aria-hidden="true" />
    <S.Grid>
      {FEATURE_CARDS.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </S.Grid>
  </S.Section>
)

export default FeaturesSection
