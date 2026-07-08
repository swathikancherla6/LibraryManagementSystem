import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Grid, Chip, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Tabs, Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchMember } from '../../store/slices/memberSlice';
import { fetchMemberBorrows } from '../../store/slices/borrowSlice';
import { fetchMemberFines } from '../../store/slices/fineSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { borrowStatusColor } from '../../utils/statusColors';

export default function MemberDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected, loading } = useSelector((state) => state.members);
  const { memberHistory } = useSelector((state) => state.borrows);
  const { memberFines } = useSelector((state) => state.fines);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    dispatch(fetchMember(id));
    dispatch(fetchMemberBorrows({ memberId: id, page: 0, size: 50 }));
    dispatch(fetchMemberFines({ memberId: id, page: 0, size: 50 }));
  }, [dispatch, id]);

  if (loading || !selected) return <LoadingSpinner />;

  const activeBorrows = memberHistory.filter((b) => b.status !== 'RETURNED');
  const returnedBooks = memberHistory.filter((b) => b.status === 'RETURNED');
  const pendingFines = memberFines.filter((f) => f.status === 'PENDING');
  const outstandingFine = pendingFines.reduce((sum, f) => sum + Number(f.amount), 0);

  const statusColor = borrowStatusColor;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/members')} sx={{ mb: 2 }}>Back to Members</Button>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight="bold">{selected.firstName} {selected.lastName}</Typography>
            <Typography color="text.secondary">{selected.email}</Typography>
          </Box>
          <Chip label={selected.active ? 'Active' : 'Inactive'} color={selected.active ? 'success' : 'default'} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">Membership #</Typography><Typography fontWeight="medium">{selected.membershipNumber}</Typography></Grid>
          <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">Type</Typography><Typography fontWeight="medium">{selected.membershipType}</Typography></Grid>
          <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">Joined</Typography><Typography fontWeight="medium">{selected.joinedDate}</Typography></Grid>
          <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">Books Borrowed</Typography><Typography fontWeight="medium">{memberHistory.length}</Typography></Grid>
          <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">Outstanding Fine</Typography><Typography fontWeight="medium" color={outstandingFine > 0 ? 'error.main' : 'inherit'}>${outstandingFine.toFixed(2)}</Typography></Grid>
        </Grid>
      </Paper>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={`Current Borrows (${activeBorrows.length})`} />
        <Tab label={`History (${returnedBooks.length})`} />
        <Tab label={`Fines (${memberFines.length})`} />
      </Tabs>

      <Paper>
        {tab === 0 && (
          activeBorrows.length ? (
            <BorrowTable rows={activeBorrows} statusColor={statusColor} />
          ) : <EmptyState message="No active borrows" />
        )}
        {tab === 1 && (
          returnedBooks.length ? (
            <BorrowTable rows={returnedBooks} statusColor={statusColor} showReturn />
          ) : <EmptyState message="No returned books" />
        )}
        {tab === 2 && (
          memberFines.length ? (
            <TableContainer>
              <Table>
                <TableHead><TableRow><TableCell>Book</TableCell><TableCell>Amount</TableCell><TableCell>Days</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                <TableBody>
                  {memberFines.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.bookTitle}</TableCell>
                      <TableCell>${f.amount}</TableCell>
                      <TableCell>{f.daysOverdue}</TableCell>
                      <TableCell><Chip label={f.status} size="small" color={f.status === 'PENDING' ? 'error' : 'success'} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : <EmptyState message="No fines" />
        )}
      </Paper>
    </Box>
  );
}

function BorrowTable({ rows, statusColor, showReturn }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Book</TableCell><TableCell>Issue Date</TableCell><TableCell>Due Date</TableCell>
            {showReturn && <TableCell>Return Date</TableCell>}<TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.bookTitle}</TableCell>
              <TableCell>{b.issueDate}</TableCell>
              <TableCell>{b.dueDate}</TableCell>
              {showReturn && <TableCell>{b.returnDate}</TableCell>}
              <TableCell><Chip label={b.status} color={statusColor(b.status)} size="small" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
