import axiosInstance from '@/api/axiosInstance'

export const getPrescriptions = async () => {
  const { data } = await axiosInstance.get('/prescriptions')
  return data
}

export const getPrescriptionById = async (id) => {
  const { data } = await axiosInstance.get(`/prescriptions/${id}`)
  return data
}

export const getPrescriptionsByCustomer = async (customerId) => {
  const { data } = await axiosInstance.get(`/prescriptions/customer/${customerId}`)
  return data
}

export const getPrescriptionsByUser = async (userId) => {
  const { data } = await axiosInstance.get(`/prescriptions/user/${userId}`)
  return data
}

export const createPrescription = async (payload) => {
  const { data } = await axiosInstance.post('/prescriptions', payload)
  return data
}

export const createPrescriptionsBulk = async (payload) => {
  const { data } = await axiosInstance.post('/prescriptions/bulk', payload)
  return data
}

export const updatePrescription = async (id, payload) => {
  const { data } = await axiosInstance.put(`/prescriptions/${id}`, payload)
  return data
}

export const deletePrescription = async (id) => {
  const { data } = await axiosInstance.delete(`/prescriptions/${id}`)
  return data
}