export const ROLES = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    OPTOMETRIST: 'OPTOMETRIST',
    CUSTOMER: 'CUSTOMER'
}

export const STAFF_ROLES = [ROLES.ADMIN, ROLES.STAFF, ROLES.OPTOMETRIST]

// <Select> options for the role picker, derived from ROLES so a new role cannot
// be added to the guards without also appearing in the admin form.
export const ROLE_OPTIONS = [
    { value: ROLES.ADMIN, label: 'Admin' },
    { value: ROLES.STAFF, label: 'Staff' },
    { value: ROLES.OPTOMETRIST, label: 'Optometrist' },
    { value: ROLES.CUSTOMER, label: 'Customer' },
]

export const hasRole = (user, role) => {
    if (!user?.role) {
        return false;
    }
    const userRole = String(user.role).toUpperCase().replace(/^ROLE_/, '');
    return userRole === String(role).toUpperCase();
}

export const isStaff = (user) => STAFF_ROLES.some((role) => hasRole(user, role));

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);