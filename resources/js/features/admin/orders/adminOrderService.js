import api from '../../../lib/api'

const getAdminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  Accept: 'application/json',
})

const normalizeOrderStatus = (status) => {
  const value = String(status || 'pending').toLowerCase()

  return {
    pending: 'pending',
    paid: 'processing',
    processing: 'processing',
    shipped: 'shipped',
    delivered: 'completed',
    completed: 'completed',
    expired: 'cancelled',
    cancelled: 'cancelled',
  }[value] || value
}

const normalizePaymentStatus = (order) => {
  const value = String(order?.payment_status || order?.payment?.transaction_status || 'unpaid').toLowerCase()

  return {
    settlement: 'paid',
    expire: 'expired',
    failure: 'failed',
    cancel: 'failed',
  }[value] || value
}

const normalizeOrder = (order) => ({
  ...order,
  status: normalizeOrderStatus(order?.status),
  payment_status: normalizePaymentStatus(order),
})

const normalizeResponse = (response) => {
  if (Array.isArray(response.data?.data)) {
    return {
      ...response,
      data: {
        ...response.data,
        data: response.data.data.map(normalizeOrder),
      },
    }
  }

  if (response.data?.data) {
    return {
      ...response,
      data: {
        ...response.data,
        data: normalizeOrder(response.data.data),
      },
    }
  }

  return response
}

export const adminOrderService = {
  async getOrders(params = {}) {
    const response = await api.get('/admin/orders', {
      params,
      headers: getAdminHeaders(),
    })

    return normalizeResponse(response)
  },

  async getOrder(id) {
    const response = await api.get(`/admin/orders/${id}`, {
      headers: getAdminHeaders(),
    })

    return normalizeResponse(response)
  },

  async updateStatus(id, status) {
    const response = await api.patch(
      `/admin/orders/${id}/status`,
      { status },
      {
        headers: getAdminHeaders(),
      }
    )

    return normalizeResponse(response)
  },

  async updatePaymentStatus(id, payment_status) {
    const response = await api.patch(
      `/admin/orders/${id}/payment-status`,
      { payment_status },
      {
        headers: getAdminHeaders(),
      }
    )

    return normalizeResponse(response)
  },

  async updateTrackingNumber(id, tracking_number, courier = null) {
    const response = await api.patch(
      `/admin/orders/${id}/tracking-number`,
      {
        tracking_number,
        courier,
      },
      {
        headers: getAdminHeaders(),
      }
    )

    return normalizeResponse(response)
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
