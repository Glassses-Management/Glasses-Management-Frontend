import axiosInstance from '@/api/axiosInstance'

export const getProducts = async (params) => {
  const { data } = await axiosInstance.get('/products', { params })
  return data
}

export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`)
  return data
}

export const createProduct = async (payload) => {
  const { data } = await axiosInstance.post('/products', payload)
  return data
}

export const updateProduct = async (id, payload) => {
  const { data } = await axiosInstance.put(`/products/${id}`, payload)
  return data
}

export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`)
  return data
}