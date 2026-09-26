import axiosInstance from '@/api/axiosInstance'

export const getAttachments = async (params) => {
  const { data } = await axiosInstance.get('/attachments', { params })
  return data
}

export const getAttachmentById = async (id) => {
  const { data } = await axiosInstance.get(`/attachments/${id}`)
  return data
}

export const getAttachmentsByUser = async (userId) => {
  const { data } = await axiosInstance.get(`/attachments/by-user/${userId}`)
  return data
}

// The signed-in account's own files (avatar). Customer pages use this because
// /attachments/by-user/{userId} is staff-only, and it accepted any userId.
export const getMyAttachments = async () => {
  const { data } = await axiosInstance.get('/attachments/mine')
  return data
}

export const getAttachmentsByProduct = async (productId) => {
  const { data } = await axiosInstance.get(`/attachments/by-product/${productId}`)
  return data
}

export const createAttachment = async (payload) => {
  const { data } = await axiosInstance.post('/attachments', payload)
  return data
}

export const uploadAttachment = async ({ file, userId, productId }) => {
  const form = new FormData()
  form.append('file', file)
  if (userId) form.append('userId', userId)
  if (productId) form.append('productId', productId)
  const { data } = await axiosInstance.post('/attachments/upload', form)
  return data
}

export const updateAttachment = async (id, payload) => {
  const { data } = await axiosInstance.put(`/attachments/${id}`, payload)
  return data
}

export const deleteAttachment = async (id) => {
  const { data } = await axiosInstance.delete(`/attachments/${id}`)
  return data
}