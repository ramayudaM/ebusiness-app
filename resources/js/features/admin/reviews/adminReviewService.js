import api from '../../../lib/api'

const getAdminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  Accept: 'application/json',
})

export const adminReviewService = {
  getReviews(params = {}) {
    return api.get('/admin/reviews', {
      params,
      headers: getAdminHeaders(),
    })
  },

  updateVisibility(id, isVisible) {
    return api.patch(
      `/admin/reviews/${id}/visibility`,
      {
        is_visible: isVisible,
      },
      {
        headers: getAdminHeaders(),
      }
    )
  },

  deleteReview(id) {
    return api.delete(`/admin/reviews/${id}`, {
      headers: getAdminHeaders(),
    })
  },
}