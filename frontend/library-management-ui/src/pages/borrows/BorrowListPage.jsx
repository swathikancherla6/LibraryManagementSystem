import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Tabs, Tab, Alert, CircularProgress,
} from '@mui/material';
import {
  fetchBorrows, fetchMyBorrows, fetchOverdue, returnBook, renewBook,
  fetchRequests, approveRequest, rejectRequest, cancelRequest,
} from '../../store/slices/borrowSlice';
import { fetchBooks } from '../../store/slices/bookSlice';
import { refreshStaffDashboard } from '../../store/slices/dashboardRefresh';
import { showNotification } from '../../store/slices/notificationSlice';
import useAuth from '../../hooks/useAuth';
import { borrowStatusColor } from '../../utils/statusColors';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function BorrowListPage() {
  const dispatch = useDispatch();
  const { list, myBorrows, overdue, requests, loading, actionLoading, error } = useSelector((state) => state.borrows);
  const { list: books } = useSelector((state) => state.books);
  const { isStaff } = useAuth();
  const [tab, setTab] = useState(0);
  const [approveTarget, setApproveTarget] = useState(null);
  const [approveLoanDays, setApproveLoanDays] = useState(14);

  const refreshAll = useCallback(() => {
    if (isStaff) {
      dispatch(fetchBorrows({ page: 0, size: 50 }));
      dispatch(fetchOverdue());
      dispatch(fetchRequests());
      dispatch(fetchBooks({ page: 0, size: 100 }));
      dispatch(refreshStaffDashboard());
    } else {
      dispatch(fetchMyBorrows());
    }
  }, [dispatch, isStaff]);

  useEffect(() => {
    if (isStaff) {
      dispatch(fetchBorrows({ page: 0, size: 50 }));
      dispatch(fetchOverdue());
      dispatch(fetchRequests());
      dispatch(fetchBooks({ page: 0, size: 100 }));
    } else {
      dispatch(fetchMyBorrows());
    }
  }, [dispatch, isStaff]);

  const handleReturn = async (id) => {
    const result = await dispatch(returnBook(id));
    if (returnBook.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Book returned successfully', severity: 'success' }));
      refreshAll();
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to return book', severity: 'error' }));
    }
  };

  const handleRenew = async (id) => {
    const result = await dispatch(renewBook(id));
    if (renewBook.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Book renewed successfully', severity: 'success' }));
      refreshAll();
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to renew book', severity: 'error' }));
    }
  };

  const handleApprove = async () => {
    const result = await dispatch(approveRequest({ id: approveTarget.id, loanDays: Number(approveLoanDays) || 14 }));
    if (approveRequest.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Book issued to member', severity: 'success' }));
      setApproveTarget(null);
      refreshAll();
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to approve request', severity: 'error' }));
    }
  };

  const handleReject = async (id) => {
    const result = await dispatch(rejectRequest(id));
    if (rejectRequest.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Request rejected', severity: 'info' }));
      refreshAll();
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to reject request', severity: 'error' }));
    }
  };

  const handleCancel = async (id) => {
    const result = await dispatch(cancelRequest(id));
    if (cancelRequest.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Request cancelled', severity: 'info' }));
      refreshAll();
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to cancel request', severity: 'error' }));
    }
  };

  const statusColor = borrowStatusColor;

  const showRequestsTab = isStaff && tab === 0;
  const displayList = isStaff ? (tab === 0 ? requests : tab === 2 ? overdue : list) : myBorrows;
  const approveBook = approveTarget ? books.find((b) => b.id === approveTarget.bookId) : null;

  if (loading && !displayList.length) return <LoadingSpinner />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">Borrows</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isStaff && (
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label={`Requests (${requests.length})`} />
          <Tab label="All Borrows" />
          <Tab label={`Overdue (${overdue.length})`} />
        </Tabs>
      )}

      {!displayList.length ? (
        <Paper><EmptyState message={showRequestsTab ? 'No pending requests' : 'No borrow records found'} /></Paper>
      ) : showRequestsTab ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Requested On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayList.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.bookTitle}</TableCell>
                  <TableCell>{r.memberName}</TableCell>
                  <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</TableCell>
                  <TableCell><Chip label={r.status} color={statusColor(r.status)} size="small" /></TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="contained" disabled={actionLoading} sx={{ mr: 1 }}
                      onClick={() => { setApproveTarget(r); setApproveLoanDays(14); }}>
                      Approve &amp; Issue
                    </Button>
                    <Button size="small" variant="outlined" color="error" disabled={actionLoading}
                      onClick={() => handleReject(r.id)}>
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                {isStaff && <TableCell>Member</TableCell>}
                <TableCell>Issue Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayList.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>{b.bookTitle}</TableCell>
                  {isStaff && <TableCell>{b.memberName}</TableCell>}
                  <TableCell>{b.issueDate || '-'}</TableCell>
                  <TableCell>{b.dueDate || '-'}</TableCell>
                  <TableCell>{b.returnDate || '-'}</TableCell>
                  <TableCell>
                    <Chip label={b.status} color={statusColor(b.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    {isStaff && b.status !== 'RETURNED' && (
                      <Button size="small" variant="outlined" disabled={actionLoading}
                        onClick={() => handleReturn(b.id)} sx={{ mr: 1 }}>
                        Return
                      </Button>
                    )}
                    {!isStaff && b.status === 'REQUESTED' && (
                      <Button size="small" variant="outlined" color="error" disabled={actionLoading}
                        onClick={() => handleCancel(b.id)}>
                        Cancel Request
                      </Button>
                    )}
                    {!isStaff && (b.status === 'ISSUED' || b.status === 'OVERDUE') && (
                      <Button size="small" variant="outlined" disabled={actionLoading}
                        onClick={() => handleRenew(b.id)}>
                        Renew
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!approveTarget} onClose={() => setApproveTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve &amp; Issue Book</DialogTitle>
        <DialogContent>
          {approveTarget && (
            <>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>{approveTarget.bookTitle}</strong> for <strong>{approveTarget.memberName}</strong>
              </Typography>
              {approveBook && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {approveBook.availableCopies} copies currently available
                </Typography>
              )}
              {approveBook && approveBook.availableCopies <= 0 && (
                <Alert severity="warning" sx={{ mt: 1 }}>No copies available right now — this will fail until a copy is returned.</Alert>
              )}
            </>
          )}
          <TextField fullWidth label="Loan Days" type="number" margin="normal" value={approveLoanDays}
            inputProps={{ min: 1, max: 90 }}
            onChange={(e) => setApproveLoanDays(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveTarget(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleApprove} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Issue Book'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
