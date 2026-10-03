const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

export const formatDate = (value: string | null): string => (value ? dateFormatter.format(new Date(value)) : '—')

export const formatPersonName = (firstName: string | null, lastName: string | null): string =>
  [firstName, lastName].filter(Boolean).join(' ') || '—'
