import api from '../../../lib/api'

const getAdminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  Accept: 'application/json',
})

export const adminReportService = {
  getOverview() {
    return api.get('/admin/reports/overview', {
      headers: getAdminHeaders(),
    })
  },
}