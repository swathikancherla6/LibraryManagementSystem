import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchDashboardStats, fetchRecentBorrows, fetchRecentBooks,
  fetchTopBorrowed, fetchDueToday, fetchStatistics, fetchMemberSummary,
} from './dashboardSlice';

/** Refreshes all staff dashboard widgets in one dispatch chain. */
export const refreshStaffDashboard = createAsyncThunk(
  'dashboard/refreshStaff',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchDashboardStats()),
      dispatch(fetchRecentBorrows()),
      dispatch(fetchRecentBooks()),
      dispatch(fetchTopBorrowed()),
      dispatch(fetchDueToday()),
      dispatch(fetchStatistics()),
    ]);
  }
);

export const refreshMemberDashboard = createAsyncThunk(
  'dashboard/refreshMember',
  async (_, { dispatch }) => {
    await dispatch(fetchMemberSummary());
  }
);
