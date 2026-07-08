import axiosInstance from './axiosInstance';

export const wishlistApi = {
  getMy: () => axiosInstance.get('/wishlist'),
  add: (bookId) => axiosInstance.post('/wishlist', { bookId }),
  remove: (bookId) => axiosInstance.delete(`/wishlist/${bookId}`),
};
