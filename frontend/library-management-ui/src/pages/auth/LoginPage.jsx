import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Link, Alert,
} from '@mui/material';
import { login, clearError } from '../../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">Sign In</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Library Management System
          </Typography>
          {error && <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" type="email" margin="normal" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField fullWidth label="Password" type="password" margin="normal" required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 2 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            No account? <Link component={RouterLink} to="/register">Register</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
