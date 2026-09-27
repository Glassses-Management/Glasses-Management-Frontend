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

// The signed-in customer's own prescriptions.
//
// There is no /prescriptions/mine route (confirmed against /v3/api-docs): such a
// request falls through to /prescriptions/{id} and Spring rejects "mine" as a
// Long with 400. The documented /prescriptions/customer/{customerId} route is
// used instead, with the id resolved from GET /api/customers/me because
// /auth/me carries no customer_id field.
export const getMyPrescriptions = async (customerId) => {
  if (customerId == null) return []
  const data = await getPrescriptionsByCustomer(customerId)
  return Array.isArray(data) ? data : []
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