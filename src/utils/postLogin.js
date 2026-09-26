import { getMyCustomer } from '@/api/customerApi'
import { hasRole, ROLES } from '@/utils/Roles'

// Decides where to send someone once they are authenticated.
//
// Staff always land on the dashboard. A customer whose account has no customer
// profile yet is sent to the completion form instead: Google cannot supply the
// phone number the customer table requires, so a brand new Google signup has a
// user record but nothing to show on the account pages.
//
// A failed lookup that is not a 404 is treated as "profile unknown" and lets the
// user through, so a network blip never locks someone out of the app.
export async function postLoginRoute(user, redirectTo) {
  if (!hasRole(user, ROLES.CUSTOMER)) {
    return '/dashboard'
  }

  try {
    await getMyCustomer()
  } catch (err) {
    if (err?.response?.status === 404) {
      return '/complete-profile'
    }
  }

  return redirectTo || '/account'
}
