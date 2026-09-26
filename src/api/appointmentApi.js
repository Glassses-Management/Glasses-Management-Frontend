import axiosInstance from '@/api/axiosInstance'

export const getAppointments = async () => {
  const { data } = await axiosInstance.get('/appointments')
  return data
}

export const getAppointmentById = async (id) => {
  const { data } = await axiosInstance.get(`/appointments/${id}`)
  return data
}

export const getAppointmentsByCustomer = async (customerId) => {
  const { data } = await axiosInstance.get(`/appointments/customer/${customerId}`)
  return data
}

// The signed-in customer's own appointments.
//
// This also fixes a pre-existing break: /api/appointments/customer/{id} never
// existed on the backend, so the old call fell through to /appointments/{id} and
// failed to bind "customer" to a Long.
export const getMyAppointments = async () => {
  const { data } = await axiosInstance.get('/appointments/mine')
  return data
}

export const getAppointmentsByOptometrist = async (optometristId) => {
  const { data } = await axiosInstance.get(`/appointments/optometrist/${optometristId}`)
  return data
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