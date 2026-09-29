import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import TrendLegend from '@/components/analytics/TrendLegend'
import TrendTooltip from '@/components/analytics/TrendTooltip'
import { AXIS_MUTED, axisTick, compactCurrencyTick, compactNumberTick, useSeriesColors } from '@/components/analytics/chartTheme'

// Presentational only. Every number arrives through `data`; there is no
// aggregation, no fetching and no business rule in this file, so the same chart
// works for any series shaped like
// [{ key, label, tooltipLabel, orders, revenue }].
//
// Two y-axes, because the series are in different units: revenue reaches into the
// thousands while orders is usually a single or double digit, so one shared axis
// would press the orders line flat against the baseline. Each axis label is
// tinted to match its series, which is what makes the pairing readable without a
// legend key. Colours come from chartTheme so the legend, tooltip, axes and lines
// cannot drift apart.

export default function BusinessTrendChart({ data }) {
  const colors = useSeriesColors()

  // A week of quiet days has to be read as nothing happening, which means the
  // points cannot be packed so tightly that they blur together. Past a handful of
  // buckets the plot scrolls sideways rather than compressing further.
  const dense = data.length > 8

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <TrendLegend colors={colors} />
      </div>

      <div className="overflow-x-auto">
        <div className={dense ? 'h-72 min-w-[560px] sm:min-w-0' : 'h-72'}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={8}
                tick={{ ...axisTick, fill: AXIS_MUTED }}
              />
              {/* Tinted to match its series so the axis is self-describing. */}
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickLine={false}
                axisLine={false}
                width={52}
                tickFormatter={compactCurrencyTick}
                tick={{ ...axisTick, fill: colors.revenue }}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={32}
                allowDecimals={false}
                tickFormatter={compactNumberTick}
                tick={{ ...axisTick, fill: colors.orders }}
              />

              <Tooltip content={<TrendTooltip colors={colors} />} cursor={{ stroke: AXIS_MUTED, strokeDasharray: '4 4' }} />

              {/* Flat translucent fill rather than a gradient: the area is a
                  backdrop for the 2px line, and a gradient under it is decoration
                  the card does not need. */}
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke={colors.revenue}
                strokeWidth={2}
                fill={colors.fill}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke={colors.orders}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
