import axiosInstance from '@/api/axiosInstance'

export const getAppointments = async () => {
  const { data } = await axiosInstance.get('/appointments')
  return data
}

export const getAppointmentById = async (id) => {
  const { data } = await axiosInstance.get(`/appointments/${id}`)
  return data
}

// The backend has no /appointments/mine, /appointments/customer/{id} or
// /appointments/optometrist/{id} route (confirmed against /v3/api-docs). A
// request to any of them falls through to /appointments/{id}, and Spring cannot
// bind "mine"/"customer" to a Long, so it answers 400.
//
// GET /api/appointments takes no filter parameters and returns the whole list,
// so the scoping happens here on the one call that does exist.
const fetchAllAppointments = async () => {
  const { data } = await axiosInstance.get('/appointments')
  return Array.isArray(data) ? data : data?.content || []
}

export const getAppointmentsByCustomer = async (customerId) => {
  const all = await fetchAllAppointments()
  return all.filter((a) => Number(a?.customer_id) === Number(customerId))
}

// The signed-in customer's own appointments. Needs the customer-profile id, which
// /auth/me does not carry - see useOwnCustomerId.
export const getMyAppointments = async (customerId) => {
  if (customerId == null) return []
  return getAppointmentsByCustomer(customerId)
}

export const getAppointmentsByOptometrist = async (optometristId) => {
  const all = await fetchAllAppointments()
  return all.filter((a) => Number(a?.optometrist_id) === Number(optometristId))
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