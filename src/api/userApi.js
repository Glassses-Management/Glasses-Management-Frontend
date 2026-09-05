import axiosInstance from '@/api/axiosInstance'

export const getUsers = async () => {
  const { data } = await axiosInstance.get('/user')
  return data
}

export const getUserById = async (id) => {
  const { data } = await axiosInstance.get(`/user/${id}`)
  return data
}

export const createUser = async (payload) => {
  const { data } = await axiosInstance.post('/user', payload)
  return data
}

export const updateUser = async (id, payload) => {
  const { data } = await axiosInstance.put(`/user/${id}`, payload)
  return data
}

export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/user/${id}`)
  return data
}