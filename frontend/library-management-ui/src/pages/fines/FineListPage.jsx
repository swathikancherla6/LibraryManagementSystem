import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, Tabs, Tab, MenuItem, TextField,
} from '@mui/material';
import { fetchFines, fetchMyFines, markFinePaid, waiveFine } from '../../store/slices/fineSlice';
import { refreshStaffDashboard } from '../../store/slices/dashboardRefresh';
import { showNotification } from '../../store/slices/notificationSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import useAuth from '../../hooks/useAuth';
import { fineStatusColor } from '../../utils/statusColors';

export default function FineListPage() {
  const dispatch = useDispatch();
  const { list, myFines, loading, actionLoading } = useSelector((state) => state.fines);
  const { isStaff, isAdmin } = useAuth();
  const [tab, setTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (isStaff) dispatch(fetchFines({ page: 0, size: 100, status: statusFilter || undefined }));
    else dispatch(fetchMyFines());
  }, [dispatch, isStaff, statusFilter]);

  const handlePay = async (id) => {
    const result = await dispatch(markFinePaid(id));
    if (markFinePaid.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Fine marked as paid', severity: 'success' }));
      dispatch(fetchFines({ page: 0, size: 100 }));
      dispatch(refreshStaffDashboard());
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to mark fine as paid', severity: 'error' }));
    }
  };

  const handleWaive = async (id) => {
    const result = await dispatch(waiveFine(id));
    if (waiveFine.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Fine waived', severity: 'success' }));
      dispatch(fetchFines({ page: 0, size: 100 }));
      dispatch(refreshStaffDashboard());
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to waive fine', severity: 'error' }));
    }
  };

  const allList = isStaff ? list : myFines;
  const pending = allList.filter((f) => f.status === 'PENDING');
  const paid = allList.filter((f) => f.status === 'PAID');
  const waived = allList.filter((f) => f.status === 'WAIVED');
  const displayList = tab === 0 ? pending : tab === 1 ? paid : waived;
  const statusColor = fineStatusColor;

  if (loading && !allList.length) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Fine Management</Typography>

      {isStaff && (
        <Box display="flex" gap={2} mb={2} alignItems="center">
          <TextField select size="small" label="Filter Status" value={statusFilter} sx={{ minWidth: 140 }}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="WAIVED">Waived</MenuItem>
          </TextField>
          <Chip label={`Pending: ${pending.length}`} color="error" variant="outlined" />
          <Chip label={`Paid: ${paid.length}`} color="success" variant="outlined" />
        </Box>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={`Pending (${pending.length})`} />
        <Tab label={`Paid (${paid.length})`} />
        <Tab label={`Waived (${waived.length})`} />
      </Tabs>

      {!displayList.length ? (
        <Paper><EmptyState message="No fines in this category" /></Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                {isStaff && <TableCell>Member</TableCell>}
                <TableCell>Amount</TableCell>
                <TableCell>Days Overdue</TableCell>
                <TableCell>Status</TableCell>
                {isStaff && <TableCell>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayList.map((f) => (
                <TableRow key={f.id} hover>
                  <TableCell>{f.bookTitle}</TableCell>
                  {isStaff && <TableCell>{f.memberName}</TableCell>}
                  <TableCell>${f.amount}</TableCell>
                  <TableCell>{f.daysOverdue}</TableCell>
                  <TableCell><Chip label={f.status} color={statusColor(f.status)} size="small" /></TableCell>
                  {isStaff && (
                    <TableCell>
                      {f.status === 'PENDING' && (
                        <>
                          <Button size="small" variant="contained" disabled={actionLoading}
                            onClick={() => handlePay(f.id)} sx={{ mr: 1 }}>Mark Paid</Button>
                          {isAdmin && (
                            <Button size="small" variant="outlined" onClick={() => handleWaive(f.id)}>Waive</Button>
                          )}
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
