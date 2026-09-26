import axiosInstance from '@/api/axiosInstance'

// The backend has a real /api/requests API. API_DOCUMENT.md section 12 only
// documents the POST, but the GET/approve/reject endpoints exist and work —
// always prefer these over reading requests out of /orders.

// The list endpoints answer with a Spring Page wrapper or a bare array
// depending on the endpoint, so normalise to a plain array.
const toList = (data) => {
  if (Array.isArray(data)) return data
  return data?.content || []
}

export const getRequests = async () => {
  const { data } = await axiosInstance.get('/requests')
  return toList(data)
}

export const getRequestById = async (id) => {
  const { data } = await axiosInstance.get(`/requests/${id}`)
  return data
}

export const getRequestsByStatus = async (status) => {
  const { data } = await axiosInstance.get(`/requests/status/${status}`)
  return toList(data)
}

// The logged-in customer's own requests. The backend resolves the customer from
// the JWT — the frontend should never send a customerId for a customer's own
// request history.
export const getMyRequests = async () => {
  const { data } = await axiosInstance.get('/requests/mine')
  return toList(data)
}

export const getRequestsByCustomer = async (customerId) => {
  const { data } = await axiosInstance.get(`/requests/customer/${customerId}`)
  return toList(data)
}

export const createRequest = async (payload) => {
  const { data } = await axiosInstance.post('/requests', payload)
  return data
}

// Admin/Staff create a request on behalf of an existing customer. Posts to the
// same /requests endpoint as the customer flow, but includes an explicit
// customerId (the backend must accept it for non-CUSTOMER roles).
export const createRequestForCustomer = async (payload) => {
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
