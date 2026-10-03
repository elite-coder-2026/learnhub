import type { SvgIconComponent } from '@mui/icons-material'
import CodeIcon from '@mui/icons-material/Code'
import WebIcon from '@mui/icons-material/Web'
import DnsIcon from '@mui/icons-material/Dns'
import StorageIcon from '@mui/icons-material/Storage'
import BarChartIcon from '@mui/icons-material/BarChart'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import CategoryIcon from '@mui/icons-material/Category'
import type { AppTheme } from '../theme'

export interface CategoryMeta {
  icon: SvgIconComponent
  tagline: string
  color: (theme: AppTheme) => string
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  Programming: { icon: CodeIcon, tagline: 'Languages, type systems, and core concepts', color: (t) => t.colors.primary },
  Frontend: { icon: WebIcon, tagline: 'Interfaces people enjoy using', color: (t) => t.colors.accent },
  Backend: { icon: DnsIcon, tagline: 'APIs, services, and server logic', color: (t) => t.colors.primaryHover },
  Databases: { icon: StorageIcon, tagline: 'Model, query, and scale your data', color: (t) => t.colors.warning },
  Data: { icon: BarChartIcon, tagline: 'Analyze and visualize information', color: (t) => t.colors.success },
  Architecture: { icon: AccountTreeIcon, tagline: 'Design systems that scale', color: (t) => t.colors.sidebarBg },
}

const FALLBACK_META: CategoryMeta = {
  icon: CategoryIcon,
  tagline: 'Explore courses in this topic',
  color: (t) => t.colors.primary,
}

export const getCategoryMeta = (category: string): CategoryMeta => CATEGORY_META[category] ?? FALLBACK_META
