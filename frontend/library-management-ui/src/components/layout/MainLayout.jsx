import { Box, Toolbar } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../store/slices/authSlice';
import Navbar from './Navbar';

export default function MainLayout({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchProfile());
  }, [dispatch, isAuthenticated]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: 1400, mx: 'auto', width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
