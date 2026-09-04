export const theme = {
  colors: {
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    surface: '#ffffff',
    background: '#f9fafb',
    border: '#e5e7eb',
    text: '#111827',
    textMuted: '#6b7280',
    error: '#dc2626',
    success: '#16a34a',
    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  fontSizes: {
    sm: '13px',
    md: '15px',
    lg: '20px',
    xl: '28px',
  },
} as const

export type AppTheme = typeof theme
