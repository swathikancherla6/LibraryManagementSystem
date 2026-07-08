import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistApi } from '../../api/wishlistApi';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await wishlistApi.getMy();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (bookId, { rejectWithValue }) => {
  try {
    const { data } = await wishlistApi.add(bookId);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (bookId, { rejectWithValue }) => {
  try {
    await wishlistApi.remove(bookId);
    return bookId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(addToWishlist.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.list = state.list.filter((w) => w.bookId !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
