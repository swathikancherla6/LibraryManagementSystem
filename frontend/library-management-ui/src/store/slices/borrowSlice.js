import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { borrowApi } from '../../api/borrowApi';

export const fetchBorrows = createAsyncThunk('borrows/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.getAll(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch borrows');
  }
});

export const fetchMyBorrows = createAsyncThunk('borrows/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.getMy();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch borrows');
  }
});

export const fetchOverdue = createAsyncThunk('borrows/overdue', async (_, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.getOverdue();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch overdue');
  }
});

export const fetchMemberBorrows = createAsyncThunk('borrows/fetchMember', async ({ memberId, ...params }, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.getMemberBorrows(memberId, params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch member borrows');
  }
});

export const fetchBookBorrows = createAsyncThunk('borrows/fetchBook', async ({ bookId, ...params }, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.getBookBorrows(bookId, params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch book borrows');
  }
});

export const issueBook = createAsyncThunk('borrows/issue', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.issue(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to issue book');
  }
});

export const returnBook = createAsyncThunk('borrows/return', async (id, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.returnBook(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to return book');
  }
});

export const renewBook = createAsyncThunk('borrows/renew', async (id, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.renew(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to renew book');
  }
});

export const requestBook = createAsyncThunk('borrows/request', async (bookId, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.requestBook(bookId);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to request book');
  }
});

export const fetchRequests = createAsyncThunk('borrows/fetchRequests', async (_, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.getRequests();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch requests');
  }
});

export const approveRequest = createAsyncThunk('borrows/approveRequest', async ({ id, loanDays }, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.approveRequest(id, loanDays);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to approve request');
  }
});

export const rejectRequest = createAsyncThunk('borrows/rejectRequest', async (id, { rejectWithValue }) => {
  try {
    const { data } = await borrowApi.rejectRequest(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to reject request');
  }
});

export const cancelRequest = createAsyncThunk('borrows/cancelRequest', async (id, { rejectWithValue }) => {
  try {
    await borrowApi.cancelRequest(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to cancel request');
  }
});

const borrowSlice = createSlice({
  name: 'borrows',
  initialState: {
    list: [],
    myBorrows: [],
    overdue: [],
    requests: [],
    memberHistory: [],
    bookHistory: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearBorrowError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; state.error = null; };
    const setLoadingDone = (state) => { state.loading = false; };
    const setActionLoading = (state) => { state.actionLoading = true; state.error = null; };
    const setActionDone = (state) => { state.actionLoading = false; };

    builder
      .addCase(fetchBorrows.pending, setLoading)
      .addCase(fetchBorrows.fulfilled, (state, action) => {
        setLoadingDone(state);
        state.list = action.payload.content;
      })
      .addCase(fetchBorrows.rejected, (state, action) => {
        setLoadingDone(state);
        state.error = action.payload;
      })
      .addCase(fetchMyBorrows.pending, setLoading)
      .addCase(fetchMyBorrows.fulfilled, (state, action) => {
        setLoadingDone(state);
        state.myBorrows = action.payload;
      })
      .addCase(fetchMyBorrows.rejected, (state, action) => {
        setLoadingDone(state);
        state.error = action.payload;
      })
      .addCase(fetchOverdue.fulfilled, (state, action) => { state.overdue = action.payload; })
      .addCase(fetchMemberBorrows.fulfilled, (state, action) => { state.memberHistory = action.payload.content; })
      .addCase(fetchBookBorrows.fulfilled, (state, action) => { state.bookHistory = action.payload.content; })
      .addCase(issueBook.pending, setActionLoading)
      .addCase(issueBook.fulfilled, (state, action) => {
        setActionDone(state);
        state.list.unshift(action.payload);
      })
      .addCase(issueBook.rejected, (state, action) => {
        setActionDone(state);
        state.error = action.payload;
      })
      .addCase(returnBook.pending, setActionLoading)
      .addCase(returnBook.fulfilled, (state, action) => {
        setActionDone(state);
        const idx = state.list.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
        state.overdue = state.overdue.filter((b) => b.id !== action.payload.id);
        const myIdx = state.myBorrows.findIndex((b) => b.id === action.payload.id);
        if (myIdx >= 0) state.myBorrows.splice(myIdx, 1);
      })
      .addCase(returnBook.rejected, (state, action) => {
        setActionDone(state);
        state.error = action.payload;
      })
      .addCase(renewBook.pending, setActionLoading)
      .addCase(renewBook.fulfilled, (state, action) => {
        setActionDone(state);
        const update = (arr) => {
          const i = arr.findIndex((b) => b.id === action.payload.id);
          if (i >= 0) arr[i] = action.payload;
        };
        update(state.list);
        update(state.myBorrows);
        update(state.overdue);
      })
      .addCase(renewBook.rejected, (state, action) => {
        setActionDone(state);
        state.error = action.payload;
      })
      .addCase(requestBook.pending, setActionLoading)
      .addCase(requestBook.fulfilled, (state, action) => {
        setActionDone(state);
        state.myBorrows.unshift(action.payload);
      })
      .addCase(requestBook.rejected, (state, action) => {
        setActionDone(state);
        state.error = action.payload;
      })
      .addCase(fetchRequests.pending, setLoading)
      .addCase(fetchRequests.fulfilled, (state, action) => {
        setLoadingDone(state);
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        setLoadingDone(state);
        state.error = action.payload;
      })
      .addCase(approveRequest.pending, setActionLoading)
      .addCase(approveRequest.fulfilled, (state, action) => {
        setActionDone(state);
        state.requests = state.requests.filter((r) => r.id !== action.payload.id);
        state.list.unshift(action.payload);
      })
      .addCase(approveRequest.rejected, (state, action) => {
        setActionDone(state);
        state.error = action.payload;
      })
      .addCase(rejectRequest.pending, setActionLoading)
      .addCase(rejectRequest.fulfilled, (state, action) => {
        setActionDone(state);
        state.requests = state.requests.filter((r) => r.id !== action.payload.id);
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        setActionDone(state);
        state.error = action.payload;
      })
      .addCase(cancelRequest.pending, setActionLoading)
      .addCase(cancelRequest.fulfilled, (state, action) => {
        setActionDone(state);
        state.requests = state.requests.filter((r) => r.id !== action.payload);
        state.myBorrows = state.myBorrows.filter((r) => r.id !== action.payload);
      })
      .addCase(cancelRequest.rejected, (state, action) => {
        setActionDone(state);
        state.error = action.payload;
      });
  },
});

export const { clearBorrowError } = borrowSlice.actions;
export default borrowSlice.reducer;
