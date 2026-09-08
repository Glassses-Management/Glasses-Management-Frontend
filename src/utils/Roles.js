export const ROLES = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    OPTOMETRIST: 'OPTOMETRIST',
    CUSTOMER: 'CUSTOMER'
}

export const STAFF_ROLES = [ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]

export const hasRole = (user, role) => {
    if (!user?.role) {
        return false;
    }
    return String(user.role).toUpperCase() === String(role).toUpperCase();
}

export const isStaff = (user) => STAFF_ROLES.some((role) => hasRole(user, role));

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);