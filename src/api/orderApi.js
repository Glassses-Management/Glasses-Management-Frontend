import axiosInstance from '@/api/axiosInstance'

export const getOrders = async (params) => {
  const { data } = await axiosInstance.get('/orders', { params })
  return data
}

export const getOrderById = async (id) => {
  const { data } = await axiosInstance.get(`/orders/${id}`)
  return data
}

export const createOrder = async (payload) => {
  const { data } = await axiosInstance.post('/orders', payload)
  return data
}

export const updateOrder = async (id, payload) => {
  const { data } = await axiosInstance.put(`/orders/${id}`, payload)
  return data
}

export const changeOrderStatus = async (id, status) => {
  const { data } = await axiosInstance.post(`/orders/${id}/status`, null, {
    params: { status },
  })
  return data
}

export const deleteOrder = async (id) => {
  const { data } = await axiosInstance.delete(`/orders/${id}`)
  return data
}