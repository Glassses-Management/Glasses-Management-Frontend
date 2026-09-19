import { CheckCircle2, Eye, EyeOff, KeyRound, Lock, XCircle } from 'lucide-react'
import RegistrationCard from '@/pages/auth/RegistrationCard'
import { CONSENT_OPTIONS, PASSWORD_RULES, fieldLabel, inputClass } from '@/pages/auth/RegisterData'

function passwordScore(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

const SCORE_LABELS = { 1: 'Weak', 2: 'Medium', 3: 'Strong', 4: 'Strong' }

function StrengthMeter({ password }) {
  const score = passwordScore(password)
  const label = score > 0 ? SCORE_LABELS[score] : 'Too Short'
  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
        Cryptographic Strength: <span className="font-semibold text-forest dark:text-leaf">{label}</span>
      </p>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={`h-1.5 flex-1 rounded-full ${segment <= score ? 'bg-forest dark:bg-leaf' : 'bg-neutral-200 dark:bg-neutral-700'}`}
          />
        ))}
      </div>
    </div>
  )
}

function PasswordField({ id, label, value, show, onToggle, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>{label}</label>
      <div className="relative">
        <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
        <input
          id={id}
          name={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className={`${inputClass} pl-10 pr-10`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function RuleRow({ rule, password }) {
  const passed = password ? rule.check(password) : false
  return (
    <li className="flex items-center gap-2 text-xs">
      {passed ? (
        <CheckCircle2 size={14} className="shrink-0 text-forest dark:text-leaf" />
      ) : (
        <XCircle size={14} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
      )}
      <span className={passed ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500'}>
        {rule.label}
      </span>
    </li>
  )
}

function ConsentRow({ option, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-mist dark:hover:bg-white/5"
    >
      {checked ? (
        <CheckCircle2 size={15} className="shrink-0 text-forest dark:text-leaf" />
      ) : (
        <span className="flex size-[15px] shrink-0 items-center justify-center rounded-full border-2 border-neutral-300 dark:border-neutral-600" />
      )}
      <span className="flex-1 text-xs text-neutral-600 dark:text-neutral-300">
        {option.label}
        {option.required && <span className="ml-1 text-forest dark:text-leaf">required</span>}
      </span>
      {option.required && <KeyRound size={12} className="shrink-0 text-neutral-300 dark:text-neutral-600" />}
    </button>
  )
}

function RegisterSectionSecurity({ form, errors, update }) {
  const toggleConsent = (key) =>
    update('consents', { ...form.consents, [key]: !form.consents[key] })

  return (
    <RegistrationCard step={3} title="Security & Credentials" status="Checklist">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <PasswordField
          id="password"
          label="Master Password"
          value={form.password}
          show={form.showPassword}
          onToggle={() => update('showPassword', !form.showPassword)}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm Master Password"
          value={form.confirmPassword}
          show={form.showConfirm}
          onToggle={() => update('showConfirm', !form.showConfirm)}
          onChange={(e) => update('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />
        <StrengthMeter password={form.password} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Live Validation
          </p>
          <ul className="space-y-2">
            {PASSWORD_RULES.map((rule) => (
              <RuleRow key={rule.key} rule={rule} password={form.password} />
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Consent &amp; Preferences
          </p>
          <div className="space-y-1">
            {CONSENT_OPTIONS.map((option) => (
              <ConsentRow
                key={option.key}
                option={option}
                checked={Boolean(form.consents[option.key])}
                onToggle={() => toggleConsent(option.key)}
              />
            ))}
          </div>
          {errors.consents && <p className="mt-2 text-xs text-red-500">{errors.consents}</p>}
        </div>
      </div>
    </RegistrationCard>
  )
}

export default RegisterSectionSecurity