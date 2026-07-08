import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/userApi';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await userApi.getUsers(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const updateUserRoles = createAsyncThunk('users/roles', async ({ id, roles }, { rejectWithValue }) => {
  try {
    const { data } = await userApi.updateRoles(id, roles);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update roles');
  }
});

export const updateUserStatus = createAsyncThunk('users/status', async ({ id, active }, { rejectWithValue }) => {
  try {
    const { data } = await userApi.updateStatus(id, active);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update user status');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRoles.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      });
  },
});

export default userSlice.reducer;
