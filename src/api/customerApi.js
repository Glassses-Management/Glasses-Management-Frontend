import axiosInstance from '@/api/axiosInstance'

export const getCustomers = async (params) => {
  const { data } = await axiosInstance.get('/customers', { params })
  return data
}

// The signed-in customer's own profile. Staff-only list routes are closed to
// customers, so customer pages must use this. Rejects with 404 when the account
// has no profile yet, which is how a new Google signup is detected.
export const getMyCustomer = async () => {
  const { data } = await axiosInstance.get('/customers/me')
  return data
}

// Creates the profile for an account that has none (the Google signup flow).
// The backend takes the email from the token, so it is not sent here.
export const completeMyProfile = async (payload) => {
  const { data } = await axiosInstance.post('/customers/complete-profile', payload)
  return data
}

export const getCustomerById = async (id) => {
  const { data } = await axiosInstance.get(`/customers/${id}`)
  return data
}

export const createCustomer = async (payload) => {
  const { data } = await axiosInstance.post('/customers', payload)
  return data
}

export const registerCustomer = async (payload) => {
  const { data } = await axiosInstance.post('/customers/register', payload)
  return data
}

export const updateCustomer = async (id, payload) => {
  const { data } = await axiosInstance.put(`/customers/${id}`, payload)
  return data
}

export const deleteCustomer = async (id) => {
  const { data } = await axiosInstance.delete(`/customers/${id}`)
  return data
}