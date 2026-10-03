import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

export const Section = styled.section`
  position: relative;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  padding: ${({ theme }) => theme.features.spacing.gap} ${({ theme }) => theme.spacing[8]};
  font-family: ${({ theme }) => theme.features.fontFamily};
  background-color: ${({ theme }) => theme.colors.bg};
  background-image: repeating-linear-gradient(
      0deg,
      ${({ theme }) => theme.features.colors.gridLine} 0 1px,
      transparent 1px ${({ theme }) => theme.features.sizes.gridCell}
    ),
    repeating-linear-gradient(
      90deg,
      ${({ theme }) => theme.features.colors.gridLine} 0 1px,
      transparent 1px ${({ theme }) => theme.features.sizes.gridCell}
    );
  isolation: isolate;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.features.spacing.gap} ${({ theme }) => theme.spacing[4]};
  }
`

export const Glow = styled.div`
  position: absolute;
  top: 50%;
  left: 15%;
  z-index: -1;
  width: ${({ theme }) => theme.features.sizes.glow};
  height: ${({ theme }) => theme.features.sizes.glow};
  background: radial-gradient(
    circle,
    ${({ theme }) => theme.features.colors.glowLavender},
    ${({ theme }) => theme.features.colors.glowPink} 45%,
    transparent 70%
  );
  filter: blur(${({ theme }) => theme.features.sizes.glowBlur});
  transform: translate(-50%, -50%);
  pointer-events: none;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: ${({ theme }) => theme.features.spacing.gap};
  max-width: ${({ theme }) => theme.features.sizes.maxWidth};
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const Card = styled.article<{ $isFeatured: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: ${({ theme }) => theme.features.spacing.cardPadding};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.features.colors.cardBorder};
  border-radius: ${({ theme }) => theme.features.radii.card};
  box-shadow: ${({ theme }) => theme.features.shadows.card};

  ${({ $isFeatured, theme }) =>
    $isFeatured &&
    css`
      border: 2px solid ${theme.colors.primary};
      box-shadow: ${theme.features.shadows.featured};

      @media (max-width: ${theme.breakpoints.lg}) {
        order: -1;
      }
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.features.spacing.block} ${({ theme }) => theme.spacing[5]};
  }
`

export const Badge = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  display: -webkit-box;
  max-width: 85%;
  padding: ${({ theme }) => theme.features.spacing.badgePadding};
  overflow: hidden;
  font-size: ${({ theme }) => theme.features.fontSizes.tag};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: ${({ theme }) => theme.features.letterSpacing.caps};
  line-height: ${({ theme }) => theme.lineHeights.tight};
  color: ${({ theme }) => theme.colors.surface};
  text-align: center;
  text-transform: uppercase;
  white-space: normal;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.features.colors.violet});
  border-radius: ${({ theme }) => theme.radii.full};
  transform: translate(-50%, -50%);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`

export const IconTile = styled.span<{ $isFeatured: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.features.sizes.iconTile};
  height: ${({ theme }) => theme.features.sizes.iconTile};
  font-size: ${({ theme }) => theme.features.sizes.iconGlyph};
  color: ${({ $isFeatured, theme }) => ($isFeatured ? theme.colors.surface : theme.colors.primary)};
  background: ${({ $isFeatured, theme }) => ($isFeatured ? theme.colors.primary : theme.colors.primarySoft)};
  border-radius: ${({ theme }) => theme.features.radii.iconTile};
  box-shadow: ${({ $isFeatured, theme }) => ($isFeatured ? theme.features.shadows.iconFeatured : 'none')};
`

export const Tag = styled.span<{ $isFeatured: boolean }>`
  padding: ${({ theme }) => theme.features.spacing.tagPadding};
  font-size: ${({ theme }) => theme.features.fontSizes.tag};
  font-weight: ${({ $isFeatured, theme }) => ($isFeatured ? theme.fontWeights.semibold : theme.fontWeights.medium)};
  color: ${({ $isFeatured, theme }) => ($isFeatured ? theme.colors.primary : theme.colors.textMuted)};
  white-space: nowrap;
  background: ${({ $isFeatured, theme }) => ($isFeatured ? theme.colors.primarySoft : theme.features.colors.pillBg)};
  border: 1px solid ${({ $isFeatured, theme }) => ($isFeatured ? theme.features.colors.primaryBorder : 'transparent')};
  border-radius: ${({ theme }) => theme.radii.full};
`

export const Title = styled.h3`
  margin-top: ${({ theme }) => theme.features.spacing.titleTop};
  font-size: ${({ theme }) => theme.features.fontSizes.title};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: ${({ theme }) => theme.features.letterSpacing.title};
  line-height: ${({ theme }) => theme.lineHeights.tight};
  color: ${({ theme }) => theme.colors.text};
`

export const Description = styled.p`
  margin-top: ${({ theme }) => theme.features.spacing.descriptionTop};
  font-size: ${({ theme }) => theme.features.fontSizes.description};
  line-height: ${({ theme }) => theme.features.lineHeights.description};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const Bullets = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.features.spacing.bulletGap};
  margin: ${({ theme }) => theme.features.spacing.block} 0 0;
  padding: 0;
  list-style: none;
`

export const Bullet = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.features.spacing.bulletPadding};
  font-size: ${({ theme }) => theme.features.fontSizes.bullet};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.features.colors.bulletBg};
  border: 1px solid ${({ theme }) => theme.features.colors.bulletBorder};
  border-radius: ${({ theme }) => theme.features.radii.bullet};
`

export const CheckSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.features.sizes.check};
  color: ${({ theme }) => theme.colors.success};
`

export const BulletBold = styled.strong`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`

export const WidgetArea = styled.div`
  margin-top: ${({ theme }) => theme.features.spacing.block};
`

const widgetBase = css`
  border-radius: ${({ theme }) => theme.features.radii.widget};
`

export const ProgressWidget = styled.div`
  ${widgetBase}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.features.spacing.widgetPadding};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.features.colors.primaryBorder};
`

export const WidgetRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`

export const ProgressLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`

export const ProgressValue = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
`

export const StatWidget = styled.div`
  ${widgetBase}
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.features.spacing.widgetPadding};
  background: ${({ theme }) => theme.features.colors.successSoft};
  border: 1px solid ${({ theme }) => theme.features.colors.successBorder};
`

export const StatText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  min-width: 0;
`

export const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.features.fontSizes.label};
  letter-spacing: ${({ theme }) => theme.features.letterSpacing.caps};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
`

export const StatValue = styled.span`
  font-size: ${({ theme }) => theme.features.fontSizes.stat};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`

export const StatUnit = styled.span`
  font-size: ${({ theme }) => theme.features.fontSizes.unit};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const TrendPill = styled.span`
  padding: ${({ theme }) => theme.features.spacing.tagPadding};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.features.colors.successStrong};
  white-space: nowrap;
  background: ${({ theme }) => theme.features.colors.successPill};
  border-radius: ${({ theme }) => theme.radii.full};
`

export const CredentialWidget = styled.div`
  ${widgetBase}
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.features.spacing.credentialPadding};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.features.colors.cardBorder};
`

export const CredentialTile = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.features.sizes.credentialTile};
  height: ${({ theme }) => theme.features.sizes.credentialTile};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.features.radii.bullet};
`

export const CredentialTitle = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`

export const CredentialMeta = styled.span`
  font-size: ${({ theme }) => theme.features.fontSizes.label};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const Footer = styled.div`
  margin-top: auto;

  &::before {
    content: '';
    display: block;
    margin-top: ${({ theme }) => theme.features.spacing.block};
    margin-bottom: ${({ theme }) => theme.features.spacing.block};
    border-top: 1px solid ${({ theme }) => theme.features.colors.cardBorder};
  }
`

export const CtaLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.features.fontSizes.ctaLink};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`

export const CtaButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  height: ${({ theme }) => theme.features.sizes.ctaHeight};
  font-size: ${({ theme }) => theme.features.fontSizes.ctaButton};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.surface};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.features.radii.cta};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`
