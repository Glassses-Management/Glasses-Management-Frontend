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

export const number = (value) =>
  value && isNaN(Number(value)) ? 'Must be a number' : ''

export const minValue = (min) => (value) =>
  value !== '' && value !== null && value !== undefined && Number(value) < min
    ? `Must be at least ${min}`
    : ''

// --- Prescription specific ---
// Validates one numeric field. blank = valid unless required.
// step (e.g. 0.25) forces the standard lens power increments.
function numericError(value, { label, required = false, min, max, step }) {
  const blank = value === '' || value === null || value === undefined
  if (required && blank) return `${label} is required`
  if (blank) return ''
  if (!Number.isFinite(Number(value))) return 'Must be a number'
  if (min !== undefined && Number(value) < min) return `${label} must be at least ${min}`
  if (max !== undefined && Number(value) > max) return `${label} must be at most ${max}`
  if (step && Math.abs(Math.round(Number(value) / step) - Number(value) / step) > 1e-9) {
    return `Use ${step} steps (e.g. -1.50, -1.75)`
  }
  return ''
}

// Returns an error map keyed by prescription form field. Backend contract is
// weaker (axis 0-180, PD >= 0, notes <= 255); these keep records usable for
// ordering: a customer must have a complete, sensible prescription.
export function prescriptionErrors(form) {
  const f = form || {}
  const errors = {
    customer_id: '',
    od_sphere: '',
    od_cylinder: '',
    od_axis: '',
    os_sphere: '',
    os_cylinder: '',
    os_axis: '',
    near_addition: '',
    pupillary_distance: '',
    notes: '',
  }

  if (!f.customer_id) errors.customer_id = 'This field is required'

  errors.od_sphere = numericError(f.od_sphere, { label: 'OD sphere', required: true, min: -30, max: 20, step: 0.25 })
  errors.os_sphere = numericError(f.os_sphere, { label: 'OS sphere', required: true, min: -30, max: 20, step: 0.25 })

  errors.od_cylinder = numericError(f.od_cylinder, { label: 'OD cylinder', min: -10, max: 10, step: 0.25 })
  errors.os_cylinder = numericError(f.os_cylinder, { label: 'OS cylinder', min: -10, max: 10, step: 0.25 })

  // Axis only makes sense when the eye has cylinder power.
  const axisCheck = (cylinderKey, axisKey, label) => {
    const cylinder = f[cylinderKey]
    const axis = f[axisKey]
    const hasCylinder = cylinder !== '' && cylinder !== null && cylinder !== undefined && Math.abs(Number(cylinder)) >= 0.25
    if (!hasCylinder) {
      return axis === '' || axis === null || axis === undefined ? '' : `${label} only applies when cylinder is entered`
    }
    if (axis === '' || axis === null || axis === undefined) return `${label} is required when cylinder is entered`
    if (!Number.isFinite(Number(axis))) return 'Must be a number'
    if (Number(axis) < 0 || Number(axis) > 180) return `${label} must be between 0 and 180`
    return ''
  }

  errors.od_axis = axisCheck('od_cylinder', 'od_axis', 'OD axis')
  errors.os_axis = axisCheck('os_cylinder', 'os_axis', 'OS axis')

  errors.near_addition = numericError(f.near_addition, { label: 'Near addition', min: 0, max: 4, step: 0.25 })
  errors.pupillary_distance = numericError(f.pupillary_distance, { label: 'Pupillary distance', min: 40, max: 80 })
  errors.notes = f.notes && String(f.notes).length > 255 ? 'Notes must be at most 255 characters' : ''

  return errors
}
