import axiosInstance from './axiosInstance';

export const userApi = {
  getUsers: (params) => axiosInstance.get('/users', { params }),
  updateRoles: (id, roles) => axiosInstance.patch(`/users/${id}/roles`, { roles }),
  updateStatus: (id, active) => axiosInstance.patch(`/users/${id}/status`, null, { params: { active } }),
};
