import { FileText, ShieldCheck, Wrench } from 'lucide-react'

const FEATURES = [
  {
    icon: FileText,
    title: 'One secure record',
    desc: 'Rx, orders and fit notes together in a single encrypted vault.',
  },
  {
    icon: Wrench,
    title: 'Lab-to-hand tracking',
    desc: 'Watch your glazing progress at every bench step, in real time.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified insurance sync',
    desc: 'Live eligibility checks against your active vision plan.',
  },
]

const AVATARS = [
  { initials: 'SC', bg: 'bg-[#8fa88f]' },
  { initials: 'MK', bg: 'bg-[#6f8a6f]' },
  { initials: 'JT', bg: 'bg-forest' },
  { initials: '+', bg: 'bg-[#16302a]' },
]

function RegisterLeftPanel() {
  return (
    <div className="hidden flex-col justify-center px-10 py-16 lg:flex xl:px-16">
      <div className="max-w-md">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-forest dark:border-neutral-700 dark:bg-white/5 dark:text-leaf">
          <span className="size-1.5 rounded-full bg-forest dark:bg-leaf" />
          Direct Optical Care
          <span className="font-medium text-neutral-400 dark:text-neutral-500">· Member Registry</span>
        </span>

        <h2 className="mt-8 font-sans text-4xl font-semibold leading-[1.1] text-neutral-900 xl:text-5xl dark:text-neutral-50">
          Clear sight.
          <br />
          <span className="italic text-forest dark:text-leaf">Effortless care.</span>
        </h2>

        <p className="mt-5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          Create a private optical profile to unlock bespoke glazing, member pricing and one-touch
          refills — all guarded by the same vault you sign in with.
        </p>

        <ul className="mt-8 space-y-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
                <Icon size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{title}</p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2">
            {AVATARS.map((a) => (
              <span
                key={a.initials}
                className={`flex size-8 items-center justify-center rounded-full text-[11px] font-semibold text-white ring-2 ring-mist-soft dark:ring-[#0E1A15] ${a.bg}`}
              >
                {a.initials}
              </span>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">Board-Certified Clinical Network</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Over 18,400 verified refractions completed this year
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterLeftPanel