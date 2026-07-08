import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { memberApi } from '../../api/memberApi';

export const fetchMembers = createAsyncThunk('members/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await memberApi.getMembers(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch members');
  }
});

export const fetchMember = createAsyncThunk('members/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await memberApi.getMember(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch member');
  }
});

export const updateMemberStatus = createAsyncThunk('members/status', async ({ id, active }, { rejectWithValue }) => {
  try {
    const { data } = await memberApi.updateStatus(id, active);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update member');
  }
});

const memberSlice = createSlice({
  name: 'members',
  initialState: { list: [], selected: null, loading: false, error: null },
  reducers: { clearSelectedMember: (state) => { state.selected = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => { state.loading = true; })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content;
      })
      .addCase(fetchMember.fulfilled, (state, action) => { state.selected = action.payload; })
      .addCase(updateMemberStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((m) => m.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      });
  },
});

export const { clearSelectedMember } = memberSlice.actions;
export default memberSlice.reducer;
