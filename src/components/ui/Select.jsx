import { forwardRef, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'

function cn(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Select = forwardRef(function Select(
    {
        label,
        placeholder = 'Select...',
        options = [],
        value,
        onChange,
        error,
        disabled = false,
        required = false,
        className = '',
        name,
        ...props
    },
    ref,
) {
    const normalizedOptions = useMemo(() => {
        const opts = options.map((opt) => {
            if (typeof opt === 'string') return { value: opt, label: opt }
            return opt
        })
        return opts
    }, [options])

    const allOption = placeholder && !normalizedOptions.some((o) => o.value === '')
        ? [{ value: 'all', label: placeholder }, ...normalizedOptions]
        : normalizedOptions

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    aria-invalid={Boolean(error)}
                    className={cn(
                        'w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm pr-10',
                        'transition-all duration-300 outline-none',
                        'focus:border-[#8fa88f] focus:ring-2 focus:ring-[#8fa88f]/20',
                        'dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500',
                        'dark:focus:border-[#8fa88f] dark:focus:ring-[#8fa88f]/20',
                        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60 dark:disabled:bg-neutral-800',
                        error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
                        className,
                    )}
                    {...props}
                >
                    {allOption.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-neutral-500" />
            </div>
            {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
        </div>
    )
})

export default Select
