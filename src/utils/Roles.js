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
    const userRole = String(user.role).toUpperCase().replace(/^ROLE_/, '');
    return userRole === String(role).toUpperCase();
}

export const isStaff = (user) => STAFF_ROLES.some((role) => hasRole(user, role));

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);