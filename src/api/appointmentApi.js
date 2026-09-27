import axiosInstance from '@/api/axiosInstance'

export const getAppointments = async () => {
  const { data } = await axiosInstance.get('/appointments')
  return data
}

export const getAppointmentById = async (id) => {
  const { data } = await axiosInstance.get(`/appointments/${id}`)
  return data
}

// Staff-only helper: there is no /appointments/optometrist/{id} route, and
// GET /appointments takes no filter parameters, so the full staff list is
// narrowed here. A customer token cannot call this - it gets 403.
export const getAppointmentsByOptometrist = async (optometristId) => {
  const { data } = await axiosInstance.get('/appointments')
  const list = Array.isArray(data) ? data : data?.content || []
  return list.filter((a) => Number(a?.optometrist_id) === Number(optometristId))
}

// The backend has no /appointments/customer/{id} or /appointments/optometrist/{id}
// route. /appointments/mine resolves the customer from the JWT, so it is the
// route a customer can use; the unfiltered /appointments list is staff-only and
// answers 403 for a customer token, so the scoping must not be done here.
export const getMyAppointments = async () => {
  const { data } = await axiosInstance.get('/appointments/mine')
  return Array.isArray(data) ? data : []
}

export const createAppointment = async (payload) => {
  const { data } = await axiosInstance.post('/appointments', payload)
  return data
}

export const updateAppointment = async (id, payload) => {
  const { data } = await axiosInstance.put(`/appointments/${id}`, payload)
  return data
}

export const deleteAppointment = async (id) => {
  const { data } = await axiosInstance.delete(`/appointments/${id}`)
  return data
}