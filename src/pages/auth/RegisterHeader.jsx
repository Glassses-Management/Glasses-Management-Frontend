import { Link } from 'react-router-dom'
import { Lock, ShieldCheck } from 'lucide-react'

function RegisterHeader() {
  return (
    <div className="border-b border-neutral-200 pb-8 dark:border-neutral-800">
      <nav className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
        <Link to="/" className="transition-colors hover:text-forest dark:hover:text-leaf">
          Home
        </Link>
        <span>/</span>
        <span>Patient Care</span>
        <span>/</span>
        <span className="font-medium text-neutral-700 dark:text-neutral-300">Create Account</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">
            <ShieldCheck size={13} />
            HIPAA-Accredited Optical Registry
          </span>
          <h1 className="mt-4 font-sans text-4xl font-semibold leading-[1.05] text-neutral-900 md:text-5xl dark:text-neutral-50">
            Join the <span className="italic text-forest dark:text-leaf">OptiCraft</span> Patient Portal
          </h1>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            Register once to unlock your digital wavefront refraction vault, bespoke glazing orders and member
            benefits.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-mist px-3 py-1.5 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:bg-[#16271F] dark:text-neutral-400">
          <Lock size={12} />
          Physical Security · REF-OD-2025-8842
        </span>
      </div>
    </div>
  )
}

export default RegisterHeader