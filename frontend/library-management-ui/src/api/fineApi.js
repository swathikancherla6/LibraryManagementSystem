import axiosInstance from './axiosInstance';

export const fineApi = {
  getFines: (params) => axiosInstance.get('/fines', { params }),
  getMy: () => axiosInstance.get('/fines/my'),
  getMemberFines: (memberId, params) => axiosInstance.get(`/fines/member/${memberId}`, { params }),
  calculate: (id) => axiosInstance.post(`/fines/${id}/calculate`),
  markPaid: (id) => axiosInstance.patch(`/fines/${id}/pay`),
  waive: (id) => axiosInstance.patch(`/fines/${id}/waive`),
};
