// Field validators for form inputs.
// Each validator returns an error string if invalid, or '' (empty) if valid.

export const required = (value) =>
  !value || (typeof value === 'string' && value.trim() === '')
    ? 'This field is required'
    : ''

export const email = (value) =>
  value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? 'Enter a valid email address'
    : ''

export const phone = (value) =>
  value && !/^[0-9+\-\s()]{7,15}$/.test(value)
    ? 'Enter a valid phone number'
    : ''

export const minLength = (min) => (value) =>
  value && value.length < min ? `Must be at least ${min} characters` : ''

export const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be at most ${max} characters` : ''

export const password = (value) => {
  if (!value) return 'Password is required'
  return value.length < 6 || value.length > 100
    ? 'Password must be 6-100 characters'
    : ''
}

export const requiredPassword = function requiredPassword(value) {
  return value && value.length >= 6 && value.length <= 100
    ? ''
    : value.length < 6
      ? 'Password must be at least 6 characters'
      : value.length > 100
        ? 'Password must be at most 100 characters'
        : 'Password is required'
}

export const composeValidators = (...validators) => (value) => {
  for (const validate of validators) {
    const error = validate(value)
    if (error) return error
  }
  return ''
}
