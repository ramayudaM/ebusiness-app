import api from '../../../lib/api'

const getAdminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  Accept: 'application/json',
})

export const adminCategoryService = {
  getCategories(params = {}) {
    return api.get('/admin/categories', {
      params,
      headers: getAdminHeaders(),
    })
  },

  getCategory(id) {
    return api.get(`/admin/categories/${id}`, {
      headers: getAdminHeaders(),
    })
  },

  createCategory(payload) {
    return api.post('/admin/categories', payload, {
      headers: getAdminHeaders(),
    })
  },

  updateCategory(id, payload) {
    return api.put(`/admin/categories/${id}`, payload, {
      headers: getAdminHeaders(),
    })
  },

  deleteCategory(id) {
    return api.delete(`/admin/categories/${id}`, {
      headers: getAdminHeaders(),
    })
  },
}