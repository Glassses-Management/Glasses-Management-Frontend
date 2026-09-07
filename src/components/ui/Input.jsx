import { forwardRef } from 'react'

// join class names, ignoring falsy values so callers can conditionally pass classes
function cn(...classes) {
    return classes.filter(Boolean).join(' ')
}

// Reusable input so every form shares the same look; forwardRef makes it work with
// react-hook-form's register()/controller without wrapping props.

const Input = forwardRef(function Input(
    {
        label,
        placeholder,
        type = 'text',
        value,
        onChange,
        error,
        icon,
        disabled = false,
        required = false,
        className = '',
        name,
        ...props
    },
    ref,
) {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        {icon}
                    </span>
                )}

                <input
                    id={name}
                    name={name}
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    aria-invalid={Boolean(error)}
                    className={cn(
                        'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-300',
                        'focus:outline-none focus:ring-2 focus:border-violet-500 focus:ring-violet-500',
                        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70',
                        'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500',
                        'dark:disabled:bg-neutral-900 dark:disabled:opacity-50',
                        icon && 'pl-10',
                        error &&
                        'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500',
                        className,
                    )}
                    {...props}
                />
            </div>

            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    )
})

export default Input
