const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const formatPrice = (priceCents: number): string =>
  priceCents === 0 ? 'Free' : usdFormatter.format(priceCents / 100)
