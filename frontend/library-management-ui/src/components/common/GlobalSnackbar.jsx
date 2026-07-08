import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification } from '../../store/slices/notificationSlice';

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.notification);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => dispatch(hideNotification())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={severity} onClose={() => dispatch(hideNotification())} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
