import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  if (loading && !list.length) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>My Wishlist</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Added</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Your wishlist is empty</TableCell>
              </TableRow>
            ) : list.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.bookTitle}</TableCell>
                <TableCell>{item.bookAuthor}</TableCell>
                <TableCell>{item.bookIsbn}</TableCell>
                <TableCell>
                  <Chip
                    label={item.availableCopies > 0 ? `${item.availableCopies} available` : 'Unavailable'}
                    color={item.availableCopies > 0 ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(item.addedAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => dispatch(removeFromWishlist(item.bookId))}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
