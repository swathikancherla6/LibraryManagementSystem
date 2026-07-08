import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../store/slices/categorySlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function CategoryListPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.categories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', description: '' });
    setDialogOpen(true);
  };

  const openEdit = (cat) => {
    setEditItem(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editItem) {
      await dispatch(updateCategory({ id: editItem.id, payload: form }));
    } else {
      await dispatch(createCategory(form));
    }
    setDialogOpen(false);
    dispatch(fetchCategories());
  };

  if (loading && !list.length) return <LoadingSpinner />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Category</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Books</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((cat) => (
              <TableRow key={cat.id} hover>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>{cat.bookCount}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEdit(cat)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => setDeleteId(cat.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="normal" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Description" margin="normal" multiline rows={2} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Category"
        message="Are you sure? Categories with books cannot be deleted."
        onConfirm={async () => { await dispatch(deleteCategory(deleteId)); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
