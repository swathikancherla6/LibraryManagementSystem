import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Switch, TextField, TablePagination, MenuItem,
} from '@mui/material';
import { fetchMembers, updateMemberStatus } from '../../store/slices/memberSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function MemberListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.members);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => { dispatch(fetchMembers({ page: 0, size: 100 })); }, [dispatch]);

  const toggleStatus = (member) => {
    dispatch(updateMemberStatus({ id: member.id, active: !member.active }));
  };

  let filtered = list.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${m.firstName} ${m.lastName} ${m.email} ${m.membershipNumber}`.toLowerCase().includes(q);
    const matchStatus = !statusFilter || (statusFilter === 'active' ? m.active : !m.active);
    return matchSearch && matchStatus;
  });

  const pageSize = 10;
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  if (loading && !list.length) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Members</Typography>
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField label="Search" size="small" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        <TextField select label="Status" size="small" value={statusFilter} sx={{ minWidth: 120 }}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
      </Box>

      {!paged.length ? (
        <Paper><EmptyState message="No members found" /></Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Membership #</TableCell><TableCell>Name</TableCell><TableCell>Email</TableCell>
                <TableCell>Type</TableCell><TableCell>Joined</TableCell><TableCell>Status</TableCell><TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((m) => (
                <TableRow key={m.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/members/${m.id}`)}>
                  <TableCell>{m.membershipNumber}</TableCell>
                  <TableCell>{m.firstName} {m.lastName}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.membershipType}</TableCell>
                  <TableCell>{m.joinedDate}</TableCell>
                  <TableCell><Chip label={m.active ? 'Active' : 'Inactive'} color={m.active ? 'success' : 'default'} size="small" /></TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Switch checked={m.active} onChange={() => toggleStatus(m)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={filtered.length} page={page}
            onPageChange={(_, p) => setPage(p)} rowsPerPage={pageSize} rowsPerPageOptions={[10]} />
        </TableContainer>
      )}
    </Box>
  );
}
