import axiosInstance from '@/api/axiosInstance'

export const getRequests = async () => {
  const { data } = await axiosInstance.get('/requests')
  return data
}

export const getRequestById = async (id) => {
  const { data } = await axiosInstance.get(`/requests/${id}`)
  return data
}

export const getRequestsByStatus = async (status) => {
  const { data } = await axiosInstance.get(`/requests/status/${status}`)
  return data
}

// The logged-in customer's own requests. The backend resolves the customer from
// the JWT — the frontend should never send a customerId for a customer's own
// request history.
export const getMyRequests = async () => {
  const { data } = await axiosInstance.get('/requests/mine')
  return data
}

export const getRequestsByCustomer = async (customerId) => {
  const { data } = await axiosInstance.get(`/requests/customer/${customerId}`)
  return data
}

export const createRequest = async (payload) => {
  const { data } = await axiosInstance.post('/requests', payload)
  return data
}

export const approveRequest = async (id) => {
  const { data } = await axiosInstance.post(`/requests/${id}/approve`)
  return data
}

export const rejectRequest = async (id) => {
  const { data } = await axiosInstance.post(`/requests/${id}/reject`)
  return data
}

export const deleteRequest = async (id) => {
  const { data } = await axiosInstance.delete(`/requests/${id}`)
  return data
}
