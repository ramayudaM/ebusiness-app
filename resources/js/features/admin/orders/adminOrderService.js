import api from '../../../lib/api'

const getAdminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  Accept: 'application/json',
})

export const adminOrderService = {
  getOrders(params = {}) {
    return api.get('/admin/orders', {
      params,
      headers: getAdminHeaders(),
    })
  },

  getOrder(id) {
    return api.get(`/admin/orders/${id}`, {
      headers: getAdminHeaders(),
    })
  },

  updateStatus(id, status) {
    return api.patch(
      `/admin/orders/${id}/status`,
      { status },
      {
        headers: getAdminHeaders(),
      }
    )
  },

  updatePaymentStatus(id, payment_status) {
    return api.patch(
      `/admin/orders/${id}/payment-status`,
      { payment_status },
      {
        headers: getAdminHeaders(),
      }
    )
  },

  updateTrackingNumber(id, tracking_number, courier = null) {
    return api.patch(
      `/admin/orders/${id}/tracking-number`,
      {
        tracking_number,
        courier,
      },
      {
        headers: getAdminHeaders(),
      }
    )
  },

  addInternalNote(id, payload) {
    return api.post(`/admin/orders/${id}/notes`, payload, {
      headers: getAdminHeaders(),
    })
  },

  sendNotification(id) {
    return api.post(
      `/admin/orders/${id}/notify`,
      {},
      {
        headers: getAdminHeaders(),
      }
    )
  },
}