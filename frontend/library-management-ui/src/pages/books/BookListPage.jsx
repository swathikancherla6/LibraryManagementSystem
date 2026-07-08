import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, TablePagination,
  MenuItem, FormControl, InputLabel, Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import { fetchBooks, deleteBook } from '../../store/slices/bookSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import { requestBook } from '../../store/slices/borrowSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import BookCover from '../../components/common/BookCover';
import { ROLES } from '../../utils/constants';

export default function BookListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, totalElements, page } = useSelector((state) => state.books);
  const { list: categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
  const roles = user?.roles ? Array.from(user.roles) : [];
  const canManage = roles.includes(ROLES.ADMIN) || roles.includes(ROLES.LIBRARIAN);
  const isMember = roles.includes(ROLES.MEMBER);

  const [search, setSearch] = useState({ title: '', author: '', isbn: '', publisher: '', categoryId: '', availability: '' });
  const [pageNum, setPageNum] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [sortBy, setSortBy] = useState('title');

  const loadBooks = (p = pageNum) => {
    const params = {
      title: search.title, author: search.author, isbn: search.isbn,
      publisher: search.publisher, page: p, size: 10,
    };
    if (search.categoryId) params.categoryId = search.categoryId;
    dispatch(fetchBooks(params));
  };

  useEffect(() => {
    loadBooks();
    dispatch(fetchCategories());
  }, [pageNum]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNum(0);
    loadBooks(0);
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteBook(deleteId));
    if (deleteBook.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Book deactivated successfully', severity: 'success' }));
      loadBooks();
    } else {
      dispatch(showNotification({ message: result.payload || 'Cannot delete book', severity: 'error' }));
    }
    setDeleteId(null);
  };

  const handleRequest = async (bookId) => {
    const result = await dispatch(requestBook(bookId));
    if (requestBook.fulfilled.match(result)) {
      dispatch(showNotification({ message: 'Request sent. A librarian will review it shortly.', severity: 'success' }));
    } else {
      dispatch(showNotification({ message: result.payload || 'Could not request this book', severity: 'error' }));
    }
  };

  let displayList = [...list];
  if (search.availability === 'available') displayList = displayList.filter((b) => b.availableCopies > 0);
  if (search.availability === 'unavailable') displayList = displayList.filter((b) => b.availableCopies === 0);
  displayList.sort((a, b) => {
    if (sortBy === 'author') return a.author.localeCompare(b.author);
    if (sortBy === 'available') return b.availableCopies - a.availableCopies;
    return a.title.localeCompare(b.title);
  });

  if (loading && !list.length) return <LoadingSpinner />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Books</Typography>
        {canManage && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/books/new')}>Add Book</Button>
        )}
      </Box>

      <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField label="Title" size="small" value={search.title} onChange={(e) => setSearch({ ...search, title: e.target.value })} />
        <TextField label="Author" size="small" value={search.author} onChange={(e) => setSearch({ ...search, author: e.target.value })} />
        <TextField label="ISBN" size="small" value={search.isbn} onChange={(e) => setSearch({ ...search, isbn: e.target.value })} />
        <TextField label="Publisher" size="small" value={search.publisher} onChange={(e) => setSearch({ ...search, publisher: e.target.value })} />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select label="Category" value={search.categoryId} onChange={(e) => setSearch({ ...search, categoryId: e.target.value })}>
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Availability</InputLabel>
          <Select label="Availability" value={search.availability} onChange={(e) => setSearch({ ...search, availability: e.target.value })}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="unavailable">Unavailable</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort</InputLabel>
          <Select label="Sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="available">Availability</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="outlined">Search</Button>
      </Paper>

      {!displayList.length ? (
        <Paper><EmptyState message="No books found" /></Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={60} />
                <TableCell>Title</TableCell><TableCell>Author</TableCell><TableCell>Publisher</TableCell>
                <TableCell>Category</TableCell><TableCell>Total</TableCell><TableCell>Available</TableCell>
                <TableCell>Borrowed</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayList.map((book) => (
                <TableRow
                  key={book.id}
                  hover
                  onClick={() => navigate(`/books/${book.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell><BookCover src={book.coverImageUrl} title={book.title} width={40} height={56} /></TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.publisher || '-'}</TableCell>
                  <TableCell>{book.categoryName}</TableCell>
                  <TableCell>{book.totalCopies}</TableCell>
                  <TableCell>{book.availableCopies}</TableCell>
                  <TableCell>{book.totalCopies - book.availableCopies}</TableCell>
                  <TableCell>
                    <Chip
                      label={book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                      color={book.availableCopies > 0 ? 'success' : 'error'}
                      size="small"
                    />
                    {!book.active && (
                      <Chip label="Inactive" size="small" sx={{ ml: 0.5 }} />
                    )}
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton onClick={() => navigate(`/books/${book.id}`)}><VisibilityIcon /></IconButton>
                    {canManage && <IconButton onClick={() => navigate(`/books/${book.id}/edit`)}><EditIcon /></IconButton>}
                    {canManage && <IconButton color="error" onClick={() => setDeleteId(book.id)}><DeleteIcon /></IconButton>}
                    {isMember && book.availableCopies > 0 && (
                      <IconButton color="secondary" onClick={() => {
                        dispatch(addToWishlist(book.id));
                        dispatch(showNotification({ message: 'Added to wishlist', severity: 'success' }));
                      }}><FavoriteBorderIcon /></IconButton>
                    )}
                    {isMember && book.active && (
                      <IconButton color="primary" title="Request to borrow" onClick={() => handleRequest(book.id)}>
                        <LibraryAddCheckIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={totalElements} page={page}
            onPageChange={(_, p) => setPageNum(p)} rowsPerPage={10} rowsPerPageOptions={[10]} />
        </TableContainer>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete Book" message="Are you sure you want to deactivate this book?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}
