import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Grid, Chip, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchBook, deleteBook } from '../../store/slices/bookSlice';
import { fetchBookBorrows, requestBook } from '../../store/slices/borrowSlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { borrowStatusColor } from '../../utils/statusColors';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import BookCover from '../../components/common/BookCover';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ROLES } from '../../utils/constants';
import { useState } from 'react';

export default function BookDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected, loading } = useSelector((state) => state.books);
  const { bookHistory } = useSelector((state) => state.borrows);
  const { user } = useSelector((state) => state.auth);
  const roles = user?.roles ? Array.from(user.roles) : [];
  const isMember = roles.includes(ROLES.MEMBER);
  const canManage = roles.includes(ROLES.ADMIN) || roles.includes(ROLES.LIBRARIAN);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBook(id));
    dispatch(fetchBookBorrows({ bookId: id, page: 0, size: 20 }));
  }, [dispatch, id]);

  const handleDelete = async () => {
    const result = await dispatch(deleteBook(id));
    if (deleteBook.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Book deactivated successfully', severity: 'success' }));
      navigate('/books');
    } else {
      dispatch(showNotification({ message: result.payload || 'Cannot delete book', severity: 'error' }));
    }
    setDeleteOpen(false);
  };

  const handleRequest = async () => {
    const result = await dispatch(requestBook(selected.id));
    if (requestBook.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Request sent. A librarian will review it shortly.', severity: 'success' }));
    } else {
      dispatch(showNotification({ message: result.payload || 'Could not request this book', severity: 'error' }));
    }
  };

  if (loading || !selected) return <LoadingSpinner />;

  const borrowedCopies = selected.totalCopies - selected.availableCopies;
  const availabilityColor = selected.availableCopies > 0 ? 'success' : 'error';

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/books')} sx={{ mb: 2 }}>Back to Books</Button>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box display="flex" gap={3}>
          <BookCover src={selected.coverImageUrl} title={selected.title} width={140} height={210} />
          <Box flex={1}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight="bold">{selected.title}</Typography>
            <Typography color="text.secondary" variant="h6" sx={{ mt: 1 }}>by {selected.author}</Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Chip label={selected.availableCopies > 0 ? 'Available' : 'Unavailable'} color={availabilityColor} />
            <Chip label={selected.active ? 'Active' : 'Inactive'} color={selected.active ? 'success' : 'default'} />
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><Typography><strong>ISBN:</strong> {selected.isbn}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Publisher:</strong> {selected.publisher || 'N/A'}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Category:</strong> {selected.categoryName}</Typography></Grid>
          <Grid item xs={12} sm={4}><Typography><strong>Total Copies:</strong> {selected.totalCopies}</Typography></Grid>
          <Grid item xs={12} sm={4}><Typography><strong>Available:</strong> {selected.availableCopies}</Typography></Grid>
          <Grid item xs={12} sm={4}><Typography><strong>Borrowed:</strong> {borrowedCopies}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Published:</strong> {selected.publishedYear || 'N/A'}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Description:</strong> {selected.description || 'No description'}</Typography></Grid>
        </Grid>
        <Box display="flex" gap={2} mt={3}>
          {isMember && selected.availableCopies > 0 && (
            <Button variant="contained" onClick={async () => {
              const result = await dispatch(addToWishlist(selected.id));
              if (addToWishlist.fulfilled.match(result)) {
                dispatch(showNotification({ message: 'Added to wishlist', severity: 'success' }));
              } else {
                dispatch(showNotification({ message: result.payload || 'Could not add to wishlist', severity: 'error' }));
              }
            }}>Add to Wishlist</Button>
          )}
          {isMember && selected.active && (
            <Button variant="contained" color="secondary" onClick={handleRequest}>
              {selected.availableCopies > 0 ? 'Request to Borrow' : 'Join Waitlist'}
            </Button>
          )}
          {canManage && (
            <>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/books/${id}/edit`)}>Edit</Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteOpen(true)}>Delete</Button>
              {selected.availableCopies > 0 && (
                <Button variant="contained" color="secondary" onClick={() => navigate('/borrows')}>Manage Requests</Button>
              )}
            </>
          )}
        </Box>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Borrow History</Typography>
        {bookHistory.length ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell><TableCell>Issue Date</TableCell>
                  <TableCell>Due Date</TableCell><TableCell>Return Date</TableCell><TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookHistory.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.memberName}</TableCell>
                    <TableCell>{b.issueDate || '-'}</TableCell>
                    <TableCell>{b.dueDate || '-'}</TableCell>
                    <TableCell>{b.returnDate || '-'}</TableCell>
                    <TableCell><Chip label={b.status} size="small" color={borrowStatusColor(b.status)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : <EmptyState message="No borrow history" />}
      </Paper>

      <ConfirmDialog open={deleteOpen} title="Delete Book" message="Are you sure? Books with active borrows cannot be deleted."
        onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}
