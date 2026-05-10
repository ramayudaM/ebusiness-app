import api from '../../../lib/api'

const getAdminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  Accept: 'application/json',
})

export const adminProductService = {
  getProducts(params = {}) {
    return api.get('/admin/products', {
      params,
      headers: getAdminHeaders(),
    })
  },

  getProduct(id) {
    return api.get(`/admin/products/${id}`, {
      headers: getAdminHeaders(),
    })
  },

  getCategories() {
    return api.get('/admin/categories', {
      headers: getAdminHeaders(),
    })
  },

  createProduct(formData) {
    return api.post('/admin/products', formData, {
      headers: {
        ...getAdminHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  updateProduct(id, formData) {
    formData.append('_method', 'PUT')

    return api.post(`/admin/products/${id}`, formData, {
      headers: {
        ...getAdminHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  deleteProduct(id) {
    return api.delete(`/admin/products/${id}`, {
      headers: getAdminHeaders(),
    })
  },

  importProducts(formData) {
    return api.post('/admin/products/import', formData, {
      headers: {
        ...getAdminHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  downloadImportTemplate() {
    return api.get('/admin/products/import/template', {
      headers: getAdminHeaders(),
      responseType: 'blob',
    })
  },
}