import axiosInstance from '@/api/axiosInstance'

export const login = async (identifier, password) => {
  const { data } = await axiosInstance.post('/auth/login', { identifier, password })
  return data
}

export const getMe = async () => {
  const { data } = await axiosInstance.get('/auth/me')
  return data
}