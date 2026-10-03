import styled from 'styled-components'
import { Link } from 'react-router-dom'
import type { AppTheme } from '../../theme'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.topBar};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const inner = `
  width: 100%;
  margin: 0 auto;
`

export const HeaderInner = styled.div`
  ${inner}
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  max-width: ${({ theme }) => theme.sizes.contentMax};
  min-height: ${({ theme }) => theme.sizes.topBar};
  padding: 0 ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing[3]};
    padding: 0 ${({ theme }) => theme.spacing[4]};
  }
`

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`

export const LogoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.sizes.avatar};
  height: ${({ theme }) => theme.sizes.avatar};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const HeaderNav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

export const NavAnchor = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-left: auto;
`

export const Main = styled.main`
  ${inner}
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[12]};
  max-width: ${({ theme }) => theme.sizes.contentMax};
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing[8]};
    padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
  }
`

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[6]};
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primarySoft}, ${({ theme }) => theme.colors.surface});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
  }
`

export const HeroTitle = styled.h1`
  max-width: 18ch;
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeights.tight};
  color: ${({ theme }) => theme.colors.text};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.xxxl};
  }
`

export const HeroText = styled.p`
  max-width: 60ch;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`

export const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(${({ theme }) => theme.sizes.courseCardMin}, 100%), 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`

const cardBase = `
  display: flex;
  flex-direction: column;
`

export const ValueCard = styled.div`
  ${cardBase}
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`

export const IconBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.sizes.iconBadge};
  height: ${({ theme }) => theme.sizes.iconBadge};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radii.full};
`

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`

export const CardText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  scroll-margin-top: ${({ theme }) => theme.sizes.topBar};
`

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const CategoryCard = styled(Link)`
  ${cardBase}
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[5]};
  color: inherit;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-${({ theme }) => theme.spacing[1]});
  }
`

export const CategoryIconBadge = styled.span<{ $color: (theme: AppTheme) => string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.sizes.iconBadge};
  height: ${({ theme }) => theme.sizes.iconBadge};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.surface};
  background: ${({ $color, theme }) => $color(theme)};
  border-radius: ${({ theme }) => theme.radii.md};
`

export const CategoryFooter = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
`

export const Footer = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

export const FooterInner = styled.div`
  ${inner}
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
  max-width: ${({ theme }) => theme.sizes.contentMax};
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  }
`

export const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};

  & a {
    color: ${({ theme }) => theme.colors.textMuted};
    text-decoration: none;
  }

  & a:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const InstructorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(${({ theme }) => theme.sizes.dropdown}, 100%), 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`
