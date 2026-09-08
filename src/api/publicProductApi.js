import axiosPublic from '@/api/axiosPublic'

// Public, unauthenticated product endpoints.
// These work without a token, e.g. on the storefront before login.

export const getPublicProducts = async (params) => {
  const { data } = await axiosPublic.get('/products', { params })
  return data
}

export const getPublicProductById = async (id) => {
  const { data } = await axiosPublic.get(`/products/${id}`)
  return data
}

export const getPublicAttachmentsByProduct = async (productId) => {
  const { data } = await axiosPublic.get(`/attachments/by-product/${productId}`)
  return data
}
