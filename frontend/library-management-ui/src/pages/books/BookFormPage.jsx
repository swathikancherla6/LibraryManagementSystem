import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, Paper, Grid, MenuItem,
} from '@mui/material';
import { createBook, updateBook, fetchBook, clearSelected } from '../../store/slices/bookSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import { refreshStaffDashboard } from '../../store/slices/dashboardRefresh';
import { showNotification } from '../../store/slices/notificationSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function BookFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected, loading, error } = useSelector((state) => state.books);
  const { list: categories } = useSelector((state) => state.categories);

  const [form, setForm] = useState({
    title: '', isbn: '', author: '', publisher: '', coverImageUrl: '',
    description: '', categoryId: '', totalCopies: 1, publishedYear: '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEdit) dispatch(fetchBook(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selected) {
      setForm({
        title: selected.title,
        isbn: selected.isbn,
        author: selected.author,
        publisher: selected.publisher || '',
        coverImageUrl: selected.coverImageUrl || '',
        description: selected.description || '',
        categoryId: selected.categoryId,
        totalCopies: selected.totalCopies,
        publishedYear: selected.publishedYear || '',
      });
    }
  }, [selected, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      totalCopies: Number(form.totalCopies),
      publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
    };
    const result = isEdit
      ? await dispatch(updateBook({ id, payload }))
      : await dispatch(createBook(payload));
    if ((isEdit ? updateBook : createBook).fulfilled.match(result)) {
      dispatch(showNotification({ message: isEdit ? 'Book updated successfully' : 'Book added successfully', severity: 'success' }));
      dispatch(refreshStaffDashboard());
      navigate('/books');
    } else {
      dispatch(showNotification({ message: result.payload || 'Failed to save book', severity: 'error' }));
    }
  };

  if (isEdit && loading) return <LoadingSpinner />;

  return (
    <Box maxWidth={700}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {isEdit ? 'Edit Book' : 'Add Book'}
      </Typography>
      <ErrorAlert message={error} />
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Title" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="ISBN" required value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Author" required value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Publisher" value={form.publisher}
                onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Cover Image URL" value={form.coverImageUrl}
                placeholder="https://covers.openlibrary.org/b/isbn/..."
                onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Category" required value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Total Copies" type="number" required value={form.totalCopies}
                onChange={(e) => setForm({ ...form, totalCopies: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Published Year" type="number" value={form.publishedYear}
                onChange={(e) => setForm({ ...form, publishedYear: e.target.value })} />
            </Grid>
          </Grid>
          <Box display="flex" gap={2} mt={3}>
            <Button type="submit" variant="contained">{isEdit ? 'Update' : 'Create'}</Button>
            <Button variant="outlined" onClick={() => navigate('/books')}>Cancel</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
