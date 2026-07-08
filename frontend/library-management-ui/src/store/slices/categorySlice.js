import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryApi } from '../../api/categoryApi';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await categoryApi.getAll();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
  }
});

export const createCategory = createAsyncThunk('categories/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await categoryApi.create(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create category');
  }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await categoryApi.update(id, payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update category');
  }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
  try {
    await categoryApi.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete category');
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: { list: [], loading: false, error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
