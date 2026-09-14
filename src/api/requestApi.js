import axiosInstance from '@/api/axiosInstance'

export const getRequests = async () => {
  const { data } = await axiosInstance.get('/requests')
  return data
}

export const createRequest = async (payload) => {
  const { data } = await axiosInstance.post('/requests', payload)
  return data
}