import axiosInstance from '@/api/axiosInstance'

export const getOrderItems = async (params) => {
  const { data } = await axiosInstance.get('/orderitem', { params })
  return data
}

export const getOrderItemById = async (id) => {
  const { data } = await axiosInstance.get(`/orderitem/${id}`)
  return data
}

export const createOrderItem = async (payload) => {
  const { data } = await axiosInstance.post('/orderitem', payload)
  return data
}

export const updateOrderItem = async (id, payload) => {
  const { data } = await axiosInstance.put(`/orderitem/${id}`, payload)
  return data
}

export const deleteOrderItem = async (id) => {
  const { data } = await axiosInstance.delete(`/orderitem/${id}`)
  return data
}