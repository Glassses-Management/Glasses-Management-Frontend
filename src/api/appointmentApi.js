import axiosInstance from '@/api/axiosInstance'

export const getAppointments = async () => {
  const { data } = await axiosInstance.get('/appointments')
  return data
}

export const getAppointmentById = async (id) => {
  const { data } = await axiosInstance.get(`/appointments/${id}`)
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