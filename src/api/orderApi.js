import axiosInstance from '@/api/axiosInstance'

export const getOrders = async (params) => {
  const { data } = await axiosInstance.get('/orders', { params })
  return data
}

// The signed-in customer's own orders.
//
// GET /api/orders/mine resolves the customer from the JWT, so it needs no id and
// no staff role, and it returns the whole list unpaginated. The unfiltered
// GET /api/orders is staff-only (403 for a customer token) and the customerId
// filter on it is rejected too, so this is the only route available to a
// customer.
export const getMyOrders = async () => {
  const { data } = await axiosInstance.get('/orders/mine')
  return Array.isArray(data) ? data : []
}

// GET /api/orders is paged and the server clamps size to
// spring.data.web.pageable.max-page-size=100, so a single call only returns the
// newest 100 matching rows. Walk the pages when every match is needed.
export const getAllOrders = async (params = {}) => {
  const orders = []
  let page = 0
  let totalPages

  do {
    const { data } = await axiosInstance.get('/orders', {
      params: { ...params, page, size: 100, sort: params.sort || 'id,desc' },
    })

    if (Array.isArray(data)) return data

    orders.push(...(data?.content || []))
    totalPages = data?.totalPages ?? 1
    page += 1
  } while (page < totalPages && page < 20)

  return orders
}

export const getOrderById = async (id) => {
  const { data } = await axiosInstance.get(`/orders/${id}`)
  return data
}

export const createOrder = async (payload) => {
  const { data } = await axiosInstance.post('/orders', payload)
  return data
}

export const updateOrder = async (id, payload) => {
  const { data } = await axiosInstance.put(`/orders/${id}`, payload)
  return data
}

export const changeOrderStatus = async (id, status) => {
  const { data } = await axiosInstance.post(`/orders/${id}/status`, null, {
    params: { status },
  })
  return data
}

export const deleteOrder = async (id) => {
  const { data } = await axiosInstance.delete(`/orders/${id}`)
  return data
}