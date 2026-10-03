import type { SvgIconComponent } from '@mui/icons-material'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import CastForEducationIcon from '@mui/icons-material/CastForEducation'
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined'

export interface FeatureBullet {
  bold: string
  rest: string
}

export type FeatureWidget =
  | { type: 'progress'; label: string; percent: number }
  | { type: 'stat'; label: string; value: string; unit: string; trend: string }
  | { type: 'credential'; title: string; meta: string }

export interface FeatureCta {
  label: string
  href: string
  variant: 'link' | 'button'
}

export interface FeatureCard {
  id: string
  icon: SvgIconComponent
  tag: string
  title: string
  description: string
  bullets: FeatureBullet[]
  widget: FeatureWidget
  cta: FeatureCta
  featured?: boolean
  badge?: string
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'learn',
    icon: ArticleOutlinedIcon,
    tag: 'For Learners',
    title: 'Learn at your pace',
    description:
      'Structured modules, bite-sized lessons, and interactive sandboxes you can pick up anytime, on any device.',
    bullets: [
      { bold: '1,400+', rest: 'interactive on-demand courses' },
      { bold: '', rest: 'Offline sync & multi-speed playback' },
      { bold: '', rest: 'Personalized curriculum & goal reminders' },
    ],
    widget: { type: 'progress', label: 'Next: Advanced UX Architecture', percent: 78 },
    cta: { label: 'Browse courses catalog', href: '/courses', variant: 'link' },
  },
  {
    id: 'teach',
    icon: CastForEducationIcon,
    tag: 'Monetize',
    title: 'Teach what you know',
    description:
      'Create curriculum, host live cohort workshops, and scale your brand with automated payments and student analytics.',
    bullets: [
      { bold: '94% Revenue Share', rest: 'with zero hidden fees' },
      { bold: '', rest: 'Drag-and-drop syllabus & assignment studio' },
      { bold: '', rest: 'Live Q&A sessions & community discord sync' },
    ],
    widget: { type: 'stat', label: 'Avg. top mentor payout', value: '$8,450', unit: '/ month', trend: '+18.4% YoY' },
    cta: { label: 'Become an Instructor', href: '/register', variant: 'button' },
    featured: true,
    badge: 'Most popular for creators',
  },
  {
    id: 'certificates',
    icon: MilitaryTechOutlinedIcon,
    tag: 'Accredited',
    title: 'Earn certificates',
    description:
      'Finish a course or track, get a globally verifiable credential, and showcase tangible skills to hiring managers.',
    bullets: [
      { bold: '1-Click LinkedIn', rest: '& resume credential export' },
      { bold: '', rest: 'Accredited partner universities & tech giants' },
      { bold: '', rest: 'Cryptographically verifiable QR validation IDs' },
    ],
    widget: { type: 'credential', title: 'Verified Professional Certificate', meta: 'ID: EDU-2026-98124 • Issued' },
    cta: { label: 'Explore credential directory', href: '/courses', variant: 'link' },
  },
]
