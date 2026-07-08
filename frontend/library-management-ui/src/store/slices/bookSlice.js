import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookApi } from '../../api/bookApi';

export const fetchBooks = createAsyncThunk('books/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await bookApi.getBooks(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch books');
  }
});

export const fetchBook = createAsyncThunk('books/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await bookApi.getBook(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch book');
  }
});

export const createBook = createAsyncThunk('books/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await bookApi.createBook(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create book');
  }
});

export const updateBook = createAsyncThunk('books/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await bookApi.updateBook(id, payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update book');
  }
});

export const deleteBook = createAsyncThunk('books/delete', async (id, { rejectWithValue }) => {
  try {
    await bookApi.deleteBook(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete book');
  }
});

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    list: [],
    selected: null,
    page: 0,
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected: (state) => { state.selected = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { state.loading = true; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBook.pending, (state) => {
        state.loading = true;
        state.selected = null;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBook.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateBook.fulfilled, (state, action) => {
        const idx = state.list.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
        state.selected = action.payload;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSelected, clearError } = bookSlice.actions;
export default bookSlice.reducer;
