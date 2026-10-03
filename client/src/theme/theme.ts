const colors = {
  primary: '#4F46E5',
  primaryHover: '#4338CA',
  primarySoft: '#EEF2FF',
  accent: '#10B981',
  warning: '#F59E0B',
  bg: '#F4F6FB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: '#0F172A',
  textMuted: '#64748B',
  sidebarBg: '#0F172A',
  sidebarText: '#CBD5E1',
  sidebarActive: '#FFFFFF',
  sidebarHover: 'rgba(255, 255, 255, 0.08)',
  error: '#DC2626',
  success: '#16A34A',
  overlay: 'rgba(15, 23, 42, 0.5)',
  background: '#F4F6FB',
} as const

const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  full: '9999px',
} as const

const fontSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  xxl: '32px',
  xxxl: '40px',
} as const

export const theme = {
  colors,
  radii,
  borderRadius: radii,
  shadows: {
    card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.06)',
    cardHover: '0 8px 24px rgba(15, 23, 42, 0.10)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
  },
  fontSizes,
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
  },
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  sizes: {
    contentMax: '1280px',
    sidebar: '240px',
    sidebarCollapsed: '72px',
    topBar: '64px',
    avatar: '36px',
    iconBadge: '44px',
    thumbnail: '120px',
    progressBar: '8px',
    chart: '240px',
    statCardSkeleton: '88px',
    courseCardSkeleton: '152px',
    courseCardMin: '280px',
    searchInput: '320px',
    dropdown: '200px',
    dropdownMenuMax: '240px',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
  },
  zIndex: {
    cardLink: 1,
    cardAction: 2,
    dropdown: 20,
    topBar: 10,
  },
} as const

export type AppTheme = typeof theme
