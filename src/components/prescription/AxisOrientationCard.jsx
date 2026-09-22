const SIZE = 150
const CENTER = SIZE / 2
const RADIUS = 58

const num = (value) => (value === null || value === undefined || value === '' ? null : Number(value))

function AxisDial({ eye, sub, dot, axis, cylinder }) {
  const deg = num(axis)
  const cyl = num(cylinder)
  const ticks = [0, 45, 90, 135, 180]

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-center dark:border-neutral-800 dark:bg-white/5">
      <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {eye}
        <span className="font-normal normal-case text-gray-400 dark:text-neutral-500">{sub}</span>
      </p>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto mt-2 h-36 w-36"
        role="img"
        aria-label={`${eye} axis ${deg === null ? 'unset' : `${deg} degrees`}`}
      >
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-200 dark:text-neutral-700" />
        {ticks.map((t) => {
          const rad = (t * Math.PI) / 180
          return (
            <line
              key={t}
              x1={CENTER + Math.cos(rad) * (RADIUS - 6)}
              y1={CENTER + Math.sin(rad) * (RADIUS - 6)}
              x2={CENTER + Math.cos(rad) * RADIUS}
              y2={CENTER + Math.sin(rad) * RADIUS}
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-300 dark:text-neutral-600"
            />
          )
        })}
        {deg !== null && (
          <line
            x1={CENTER - RADIUS + 8}
            y1={CENTER}
            x2={CENTER + RADIUS - 8}
            y2={CENTER}
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 4"
            transform={`rotate(${deg} ${CENTER} ${CENTER})`}
          />
        )}
        <circle cx={CENTER} cy={CENTER} r="2.5" fill="#ef4444" />
      </svg>
      <p className="mt-2 text-base font-bold tabular-nums text-gray-900 dark:text-neutral-50">
        {deg === null ? '—' : `${deg}°`}
      </p>
      <p className="text-xs text-gray-500 dark:text-neutral-400">Cyl {cyl === null ? '—' : cyl}</p>
    </div>
  )
}

function AxisOrientationCard({ prescription }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-4 w-1 shrink-0 rounded-full bg-emerald-500" />
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-neutral-50">Axis Orientation</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">Cylinder axis angles shown per eye (0–180°).</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AxisDial eye="OD" sub="Right" dot="bg-emerald-500" axis={prescription.od_axis} cylinder={prescription.od_cylinder} />
        <AxisDial eye="OS" sub="Left" dot="bg-sky-500" axis={prescription.os_axis} cylinder={prescription.os_cylinder} />
      </div>
    </section>
  )
}

export default AxisOrientationCard