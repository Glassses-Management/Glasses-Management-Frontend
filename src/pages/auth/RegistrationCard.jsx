function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function RegistrationCard({ step, title, status, tone = 'neutral', errors, children }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white dark:bg-leaf dark:text-forest">
            {step}
          </span>
          <h2 className="font-sans text-base font-semibold text-neutral-900 dark:text-neutral-50">{title}</h2>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            tone === 'ok'
              ? 'bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf'
              : 'bg-mist text-neutral-500 dark:bg-white/5 dark:text-neutral-400',
          )}
        >
          {status}
        </span>
      </div>
      {errors && (
        <p className="pt-4 text-xs font-medium text-red-500 dark:text-red-400">{errors}</p>
      )}
      <div className="pt-5">{children}</div>
    </section>
  )
}

export default RegistrationCard