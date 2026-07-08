import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookReducer from './slices/bookSlice';
import categoryReducer from './slices/categorySlice';
import memberReducer from './slices/memberSlice';
import borrowReducer from './slices/borrowSlice';
import fineReducer from './slices/fineSlice';
import wishlistReducer from './slices/wishlistSlice';
import dashboardReducer from './slices/dashboardSlice';
import notificationReducer from './slices/notificationSlice';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    categories: categoryReducer,
    members: memberReducer,
    borrows: borrowReducer,
    fines: fineReducer,
    wishlist: wishlistReducer,
    dashboard: dashboardReducer,
    notification: notificationReducer,
    theme: themeReducer,
    users: userReducer,
  },
});

export default store;
