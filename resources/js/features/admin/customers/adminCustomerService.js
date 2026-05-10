import api from '../../../lib/api'

const getAdminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  Accept: 'application/json',
})

export const adminCustomerService = {
  getCustomers(params = {}) {
    return api.get('/admin/customers', {
      params,
      headers: getAdminHeaders(),
    })
  },

  getCustomer(id) {
    return api.get(`/admin/customers/${id}`, {
      headers: getAdminHeaders(),
    })
  },

  deactivateCustomer(id) {
    return api.patch(
      `/admin/customers/${id}/deactivate`,
      {},
      {
        headers: getAdminHeaders(),
      }
    )
  },

  restoreCustomer(id) {
    return api.patch(
      `/admin/customers/${id}/restore`,
      {},
      {
        headers: getAdminHeaders(),
      }
    )
  },
}