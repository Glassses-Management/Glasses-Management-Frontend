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

const toList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  return []
}

const userRoles = (u) => {
  if (!u) return []
  if (typeof u.role === 'string') return [u.role]
  if (typeof u.role?.name === 'string') return [u.role.name]
  if (typeof u.role?.role === 'string') return [u.role.role]
  if (typeof u.role?.authority === 'string') return [u.role.authority]
  if (Array.isArray(u.roles)) return u.roles.map((r) => r?.name || r?.role || String(r))
  if (Array.isArray(u.authorities)) return u.authorities.map((a) => a?.authority || a?.role || String(a))
  return []
}

const isOptometrist = (u) =>
  userRoles(u).some((role) =>
    String(role)
      .toUpperCase()
      .replace(/^ROLE_/, '') === 'OPTOMETRIST',
  )

export const getOptometrists = async () => {
  const users = await getUsers()
  const list = toList(users)
  const optometrists = list.filter(isOptometrist)

  if (optometrists.length === 0) {
    const rolesSeen = [
      ...new Set(
        list.map((u) =>
          JSON.stringify({
            role: u.role,
            roles: u.roles,
            authorities: u.authorities,
            type: u.type,
            user_role: u.user_role,
          }),
        ),
      ),
    ]
    console.warn('[getOptometrists] roles seen:', rolesSeen, 'sample user:', list[0])
  }

  return optometrists
}