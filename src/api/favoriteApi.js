import axiosInstance from '@/api/axiosInstance'

// Wishlist endpoints. Every call is scoped to the signed-in customer by the
// backend, which reads the owner from the JWT. Nothing here sends a customer id.
export const getFavorites = async () => {
  const { data } = await axiosInstance.get('/favorites')
  return Array.isArray(data) ? data : []
}

export const addFavorite = async (productId) => {
  const { data } = await axiosInstance.post(`/favorites/${productId}`)
  return data
}

export const removeFavorite = async (productId) => {
  await axiosInstance.delete(`/favorites/${productId}`)
}

export const checkFavorite = async (productId) => {
  const { data } = await axiosInstance.get(`/favorites/${productId}`)
  return Boolean(data?.favorited)
}
