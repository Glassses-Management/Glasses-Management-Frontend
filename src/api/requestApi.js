import axiosInstance from '@/api/axiosInstance'

export const createRequest = async (payload) => {
  const { data } = await axiosInstance.post('/requests', payload)
  return data
}