import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, TextField, Button, Grid, Alert,
} from '@mui/material';
import { updateProfile } from '../../store/slices/authSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await dispatch(updateProfile(form));
    setSaving(false);
    if (updateProfile.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Profile updated successfully', severity: 'success' }));
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to update profile', severity: 'error' }));
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <Box maxWidth={600}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>My Profile</Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" value={user.email} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" required value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" required value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 1 }}>
                Roles: {user.roles ? Array.from(user.roles).join(', ') : 'N/A'}
              </Alert>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
