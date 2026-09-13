import { forwardRef, useMemo } from 'react'

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
                <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
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
                    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm',
                    'transition-colors duration-300 focus:outline-none focus:ring-2 focus:border-violet-500 focus:ring-violet-500',
                    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70',
                    'dark:border-neutral-600 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500',
                    'dark:disabled:bg-neutral-800',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
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
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    )
})

export default Select
