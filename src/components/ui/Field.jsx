import Input from '@/components/ui/Input'

// Label row with a small icon + red asterisk, the Input itself, and optional
// helper text. Keeps the form page clean by bundling repeated label markup.
function Field({ label, icon: Icon, helper, required = false, children, ...inputProps }) {
  return (
    <div>
      <label
        htmlFor={inputProps.name}
        className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-neutral-300"
      >
        <Icon size={14} className="text-gray-400 dark:text-neutral-500" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children || <Input required={required} {...inputProps} />}
      {helper && <p className="mt-1.5 text-xs text-gray-400 dark:text-neutral-500">{helper}</p>}
    </div>
  )
}

export default Field