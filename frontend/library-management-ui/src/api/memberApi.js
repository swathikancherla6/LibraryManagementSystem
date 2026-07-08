import axiosInstance from './axiosInstance';

export const memberApi = {
  getMembers: (params) => axiosInstance.get('/members', { params }),
  getMember: (id) => axiosInstance.get(`/members/${id}`),
  create: (data) => axiosInstance.post('/members', data),
  update: (id, data) => axiosInstance.put(`/members/${id}`, data),
  updateStatus: (id, active) => axiosInstance.patch(`/members/${id}/status`, null, { params: { active } }),
};
