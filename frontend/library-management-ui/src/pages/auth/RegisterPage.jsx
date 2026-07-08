import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Link, Alert, Grid,
} from '@mui/material';
import { register, clearError } from '../../store/slices/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Card sx={{ width: 500, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">Create Account</Typography>
          {error && <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="First Name" required
                  value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Last Name" required
                  value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" type="email" required
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Phone"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Password" type="password" required
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </Grid>
            </Grid>
            <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
              {loading ? 'Creating...' : 'Register'}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account? <Link component={RouterLink} to="/login">Sign In</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
