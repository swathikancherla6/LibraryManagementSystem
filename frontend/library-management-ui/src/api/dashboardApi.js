import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getStats: () => axiosInstance.get('/dashboard/stats'),
  getMemberSummary: () => axiosInstance.get('/dashboard/member-summary'),
  getRecentBorrows: () => axiosInstance.get('/dashboard/recent-borrows'),
  getRecentBooks: () => axiosInstance.get('/dashboard/recent-books'),
  getTopBorrowed: () => axiosInstance.get('/dashboard/top-borrowed'),
  getDueToday: () => axiosInstance.get('/dashboard/due-today'),
  getStatistics: () => axiosInstance.get('/dashboard/statistics'),
};
