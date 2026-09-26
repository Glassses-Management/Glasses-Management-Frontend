import axiosInstance from '@/api/axiosInstance'

export const login = async (identifier, password) => {
  const { data } = await axiosInstance.post('/auth/login', { identifier, password })
  return data
}

export const getMe = async () => {
  const { data } = await axiosInstance.get('/auth/me')
  return data
}

export const googleLogin = async (credential) => {
  const { data } = await axiosInstance.post('/auth/google', { credential })
  return data
}

// Reports whether a Google identity already has an account. Used by the
// registration page so it can send an existing address to the sign-in page
// instead of silently signing the person in.
export const googleAccountExists = async (credential) => {
  const { data } = await axiosInstance.post('/auth/google/exists', { credential })
  return Boolean(data?.exists)
}

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await axiosInstance.put('/auth/change-password', {
    currentPassword,
    newPassword,
  })
  return data
}