import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fineApi } from '../../api/fineApi';

export const fetchFines = createAsyncThunk('fines/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await fineApi.getFines(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch fines');
  }
});

export const fetchMyFines = createAsyncThunk('fines/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const { data } = await fineApi.getMy();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch fines');
  }
});

export const fetchMemberFines = createAsyncThunk('fines/fetchMember', async ({ memberId, ...params }, { rejectWithValue }) => {
  try {
    const { data } = await fineApi.getMemberFines(memberId, params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch member fines');
  }
});

export const markFinePaid = createAsyncThunk('fines/pay', async (id, { rejectWithValue }) => {
  try {
    const { data } = await fineApi.markPaid(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to mark fine as paid');
  }
});

export const waiveFine = createAsyncThunk('fines/waive', async (id, { rejectWithValue }) => {
  try {
    const { data } = await fineApi.waive(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to waive fine');
  }
});

const updateFineInList = (list, fine) => {
  const idx = list.findIndex((f) => f.id === fine.id);
  if (idx >= 0) list[idx] = fine;
};

const fineSlice = createSlice({
  name: 'fines',
  initialState: { list: [], myFines: [], memberFines: [], loading: false, actionLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFines.pending, (state) => { state.loading = true; })
      .addCase(fetchFines.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content;
      })
      .addCase(fetchFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyFines.pending, (state) => { state.loading = true; })
      .addCase(fetchMyFines.fulfilled, (state, action) => {
        state.loading = false;
        state.myFines = action.payload;
      })
      .addCase(fetchMemberFines.fulfilled, (state, action) => {
        state.memberFines = action.payload.content;
      })
      .addCase(markFinePaid.pending, (state) => { state.actionLoading = true; })
      .addCase(markFinePaid.fulfilled, (state, action) => {
        state.actionLoading = false;
        updateFineInList(state.list, action.payload);
        updateFineInList(state.myFines, action.payload);
      })
      .addCase(waiveFine.fulfilled, (state, action) => {
        updateFineInList(state.list, action.payload);
        updateFineInList(state.myFines, action.payload);
      });
  },
});

export default fineSlice.reducer;
