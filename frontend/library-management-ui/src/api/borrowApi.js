import axiosInstance from './axiosInstance';

export const borrowApi = {
  issue: (data) => axiosInstance.post('/borrows/issue', data),
  returnBook: (id) => axiosInstance.post(`/borrows/${id}/return`),
  renew: (id) => axiosInstance.post(`/borrows/${id}/renew`),
  getAll: (params) => axiosInstance.get('/borrows', { params }),
  getOverdue: () => axiosInstance.get('/borrows/overdue'),
  getMy: () => axiosInstance.get('/borrows/my'),
  getMemberBorrows: (memberId, params) => axiosInstance.get(`/borrows/member/${memberId}`, { params }),
  getBookBorrows: (bookId, params) => axiosInstance.get(`/borrows/book/${bookId}`, { params }),
  requestBook: (bookId) => axiosInstance.post('/borrows/requests', { bookId }),
  getRequests: () => axiosInstance.get('/borrows/requests'),
  approveRequest: (id, loanDays) => axiosInstance.post(`/borrows/requests/${id}/approve`, loanDays ? { loanDays } : {}),
  rejectRequest: (id) => axiosInstance.post(`/borrows/requests/${id}/reject`),
  cancelRequest: (id) => axiosInstance.delete(`/borrows/requests/${id}`),
};
