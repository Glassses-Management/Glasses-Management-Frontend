import axiosInstance from '@/api/axiosInstance'

export const getCustomers = async (params) => {
  const { data } = await axiosInstance.get('/customers', { params })
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