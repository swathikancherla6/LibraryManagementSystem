import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../api/dashboardApi';

export const fetchDashboardStats = createAsyncThunk('dashboard/stats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await dashboardApi.getStats();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchMemberSummary = createAsyncThunk('dashboard/memberSummary', async (_, { rejectWithValue }) => {
  try {
    const { data } = await dashboardApi.getMemberSummary();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch summary');
  }
});

export const fetchRecentBorrows = createAsyncThunk('dashboard/recentBorrows', async (_, { rejectWithValue }) => {
  try {
    const { data } = await dashboardApi.getRecentBorrows();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch recent borrows');
  }
});

export const fetchRecentBooks = createAsyncThunk('dashboard/recentBooks', async (_, { rejectWithValue }) => {
  try {
    const { data } = await dashboardApi.getRecentBooks();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch recent books');
  }
});

export const fetchTopBorrowed = createAsyncThunk('dashboard/topBorrowed', async (_, { rejectWithValue }) => {
  try {
    const { data } = await dashboardApi.getTopBorrowed();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch top books');
  }
});

export const fetchDueToday = createAsyncThunk('dashboard/dueToday', async (_, { rejectWithValue }) => {
  try {
    const { data } = await dashboardApi.getDueToday();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch due today');
  }
});

export const fetchStatistics = createAsyncThunk('dashboard/statistics', async (_, { rejectWithValue }) => {
  try {
    const { data } = await dashboardApi.getStatistics();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch statistics');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    memberSummary: null,
    recentBorrows: [],
    recentBooks: [],
    topBorrowed: [],
    dueToday: [],
    statistics: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; state.error = null; };
    const setDone = (state) => { state.loading = false; };

    builder
      .addCase(fetchDashboardStats.pending, setLoading)
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        setDone(state);
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        setDone(state);
        state.error = action.payload;
      })
      .addCase(fetchMemberSummary.pending, setLoading)
      .addCase(fetchMemberSummary.fulfilled, (state, action) => {
        setDone(state);
        state.memberSummary = action.payload;
      })
      .addCase(fetchMemberSummary.rejected, (state, action) => {
        setDone(state);
        state.error = action.payload;
      })
      .addCase(fetchRecentBorrows.fulfilled, (state, action) => { state.recentBorrows = action.payload; })
      .addCase(fetchRecentBooks.fulfilled, (state, action) => { state.recentBooks = action.payload; })
      .addCase(fetchTopBorrowed.fulfilled, (state, action) => { state.topBorrowed = action.payload; })
      .addCase(fetchDueToday.fulfilled, (state, action) => { state.dueToday = action.payload; })
      .addCase(fetchStatistics.fulfilled, (state, action) => { state.statistics = action.payload; });
  },
});

export default dashboardSlice.reducer;
