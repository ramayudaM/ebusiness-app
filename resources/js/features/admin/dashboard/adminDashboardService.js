import api from '../../../lib/api'

const getAdminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  Accept: 'application/json',
})

export const adminDashboardService = {
  getOverview() {
    return api.get('/admin/dashboard/overview', {
      headers: getAdminHeaders(),
    })
  },
}