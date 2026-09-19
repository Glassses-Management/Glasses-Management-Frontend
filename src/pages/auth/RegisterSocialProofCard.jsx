import { Star, Store } from 'lucide-react'

function RegisterSocialProofCard() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#16271F]">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4].map((star) => (
          <Star key={star} size={15} className="fill-amber-400 text-amber-400" />
        ))}
        <Star size={15} className="fill-amber-400/40 text-amber-400/60" />
        <span className="ml-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-50">4.9</span>
      </div>
      <p className="mt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">1,240+ Verified Patients</p>
      <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        Rated highest in the county for clinical accuracy and same-week bespoke glazing.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-mist-soft p-3 dark:bg-[#1E332B]">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-forest text-white dark:bg-leaf dark:text-forest">
          <Store size={20} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50">OptiCraft · El Cajon</p>
          <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">Historic Story St. showroom</p>
        </div>
      </div>
    </section>
  )
}

export default RegisterSocialProofCard