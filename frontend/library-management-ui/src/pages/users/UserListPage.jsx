import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Switch, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, FormGroup, FormControlLabel, Checkbox,
} from '@mui/material';
import { fetchUsers, updateUserRoles, updateUserStatus } from '../../store/slices/userSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ROLES } from '../../utils/constants';

const ALL_ROLES = [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER];

export default function UserListPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.users);
  const [editUser, setEditUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => { dispatch(fetchUsers({ page: 0, size: 50 })); }, [dispatch]);

  const openRoleDialog = (user) => {
    setEditUser(user);
    setSelectedRoles(user.roles ? Array.from(user.roles) : []);
  };

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const saveRoles = async () => {
    if (!selectedRoles.length) {
      dispatch(showNotification({ message: 'At least one role is required', severity: 'warning' }));
      return;
    }
    const result = await dispatch(updateUserRoles({ id: editUser.id, roles: selectedRoles }));
    if (updateUserRoles.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Roles updated', severity: 'success' }));
      setEditUser(null);
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to update roles', severity: 'error' }));
    }
  };

  const toggleStatus = async (user) => {
    const result = await dispatch(updateUserStatus({ id: user.id, active: !user.active }));
    if (updateUserStatus.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'User status updated', severity: 'success' }));
    }
  };

  if (loading && !list.length) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>User Management</Typography>
      {!list.length ? (
        <Paper><EmptyState message="No users found" /></Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.firstName} {u.lastName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {u.roles && Array.from(u.roles).map((r) => (
                      <Chip key={r} label={r} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip label={u.active ? 'Active' : 'Inactive'} color={u.active ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openRoleDialog(u)} sx={{ mr: 1 }}>Edit Roles</Button>
                    <Switch checked={u.active} onChange={() => toggleStatus(u)} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Roles — {editUser?.email}</DialogTitle>
        <DialogContent>
          <FormGroup>
            {ALL_ROLES.map((role) => (
              <FormControlLabel
                key={role}
                control={<Checkbox checked={selectedRoles.includes(role)} onChange={() => toggleRole(role)} />}
                label={role}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveRoles}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
