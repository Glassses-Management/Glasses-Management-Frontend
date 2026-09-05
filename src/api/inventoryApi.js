import axiosInstance from '@/api/axiosInstance'

export const getInventories = async () => {
  const { data } = await axiosInstance.get('/inventories')
  return data
}

export const getLowStock = async () => {
  const { data } = await axiosInstance.get('/inventories/low-stock')
  return data
}

export const getInventoryById = async (id) => {
  const { data } = await axiosInstance.get(`/inventories/${id}`)
  return data
}

export const createInventory = async (payload) => {
  const { data } = await axiosInstance.post('/inventories', payload)
  return data
}

export const updateInventory = async (id, payload) => {
  const { data } = await axiosInstance.put(`/inventories/${id}`, payload)
  return data
}

export const deleteInventory = async (id) => {
  const { data } = await axiosInstance.delete(`/inventories/${id}`)
  return data
}