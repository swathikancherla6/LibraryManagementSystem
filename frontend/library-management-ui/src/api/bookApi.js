import axiosInstance from './axiosInstance';

export const bookApi = {
  getBooks: (params) => axiosInstance.get('/books', { params }),
  getBook: (id) => axiosInstance.get(`/books/${id}`),
  createBook: (data) => axiosInstance.post('/books', data),
  updateBook: (id, data) => axiosInstance.put(`/books/${id}`, data),
  deleteBook: (id) => axiosInstance.delete(`/books/${id}`),
};
