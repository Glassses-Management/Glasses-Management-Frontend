import { useTheme } from '@/hook/UseTheme'

// SVG cannot be themed with the usual `dark:` utility classes here. Recharts
// puts the `className` given to Area/Line on a wrapping <g>, while the visible
// <path> carries its own stroke/fill attributes, and an element's own attribute
// always beats a value merely inherited from an ancestor. So the series colours
// are read from the app's theme and handed to Recharts as real props instead.
// AXIS_MUTED is the one exception: a mid grey that reads on both card surfaces.

export const AXIS_MUTED = '#9ca3af'

const SERIES_BY_THEME = {
  light: { revenue: '#1b3b2f', fill: 'rgba(27, 59, 47, 0.1)', orders: '#8b5cf6', grid: '#f3f4f6' },
  dark: { revenue: '#8fc0a5', fill: 'rgba(143, 192, 165, 0.16)', orders: '#a78bfa', grid: '#262626' },
}

export function useSeriesColors() {
  const { theme } = useTheme()
  return SERIES_BY_THEME[theme === 'dark' ? 'dark' : 'light']
}

// Revenue ticks only need enough precision to tell $1.2K from $1.3K.
const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const compactNumber = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export const compactCurrencyTick = compactCurrency.format
export const compactNumberTick = compactNumber.format

export const axisTick = { fontSize: 11 }
