import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Card, CardContent, Typography, Box, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { refreshStaffDashboard, refreshMemberDashboard } from '../../store/slices/dashboardRefresh';
import { CategoryBarChart, TrendLineChart, BorrowReturnChart } from '../../components/common/DashboardCharts';
import EmptyState from '../../components/common/EmptyState';
import useAuth from '../../hooks/useAuth';
import { borrowStatusColor } from '../../utils/statusColors';
import FavoriteIcon from '@mui/icons-material/Favorite';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Card
    sx={{
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': onClick ? { transform: 'translateY(-4px)', boxShadow: 4 } : {},
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" variant="body2">{title}</Typography>
          <Typography variant="h4" fontWeight="bold">{value ?? 0}</Typography>
        </Box>
        <Box sx={{ bgcolor: `${color}.light`, borderRadius: 2, p: 1.5, color: `${color}.main` }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const QuickAction = ({ label, icon, onClick, color = 'primary' }) => (
  <Button
    variant="outlined"
    startIcon={icon}
    onClick={onClick}
    sx={{ py: 1.5, flex: 1, minWidth: 140, borderColor: `${color}.main`, '&:hover': { bgcolor: `${color}.light` } }}
  >
    {label}
  </Button>
);

const statusColor = borrowStatusColor;

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isStaff } = useAuth();
  const {
    stats, memberSummary, recentBorrows, recentBooks, topBorrowed,
    dueToday, statistics, loading,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (isStaff) dispatch(refreshStaffDashboard());
    else dispatch(refreshMemberDashboard());
  }, [dispatch, isStaff]);

  if (loading && !stats && !memberSummary) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={48} />
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rounded" height={120} /></Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Welcome, {user?.firstName}!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {isStaff ? 'Library overview dashboard' : 'Your library activity summary'}
      </Typography>

      {isStaff && stats && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Total Books" value={stats.totalBooks} icon={<MenuBookIcon />} color="primary" onClick={() => navigate('/books')} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Total Members" value={stats.totalMembers} icon={<PeopleIcon />} color="secondary" onClick={() => navigate('/members')} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Borrowed Books" value={stats.borrowedBooks} icon={<SwapHorizIcon />} color="info" onClick={() => navigate('/borrows')} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Available Copies" value={stats.availableBooks} icon={<InventoryIcon />} color="success" onClick={() => navigate('/books')} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Overdue Books" value={stats.overdueBooks} icon={<WarningIcon />} color="error" onClick={() => navigate('/borrows')} />
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Quick Actions</Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <QuickAction label="Add Book" icon={<AddIcon />} onClick={() => navigate('/books/new')} />
              <QuickAction label="Add Member" icon={<PersonAddIcon />} onClick={() => navigate('/members')} color="secondary" />
              <QuickAction label="Manage Requests" icon={<SwapHorizIcon />} onClick={() => navigate('/borrows')} color="info" />
              <QuickAction label="Return Book" icon={<AssignmentReturnIcon />} onClick={() => navigate('/borrows')} color="success" />
            </Box>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Borrow Activity</Typography>
                {recentBorrows.length ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Book</TableCell>
                          <TableCell>Member</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentBorrows.slice(0, 5).map((b) => (
                          <TableRow key={b.id}>
                            <TableCell>{b.bookTitle}</TableCell>
                            <TableCell>{b.memberName}</TableCell>
                            <TableCell>{b.issueDate}</TableCell>
                            <TableCell><Chip label={b.status} color={statusColor(b.status)} size="small" /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : <EmptyState message="No recent borrows" />}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Recently Added Books</Typography>
                {recentBooks.length ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell>Author</TableCell>
                          <TableCell>Available</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentBooks.slice(0, 5).map((b) => (
                          <TableRow key={b.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/books/${b.id}`)}>
                            <TableCell>{b.title}</TableCell>
                            <TableCell>{b.author}</TableCell>
                            <TableCell>{b.availableCopies}/{b.totalCopies}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : <EmptyState message="No books yet" />}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Top Borrowed Books</Typography>
                {topBorrowed.length ? topBorrowed.map((b, i) => (
                  <Box key={b.bookId} display="flex" justifyContent="space-between" py={0.75} borderBottom="1px solid" borderColor="divider">
                    <Typography variant="body2">{i + 1}. {b.title}</Typography>
                    <Chip label={b.borrowCount} size="small" color="primary" />
                  </Box>
                )) : <EmptyState message="No borrow data" />}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Due Today</Typography>
                {dueToday.length ? dueToday.map((b) => (
                  <Box key={b.id} py={0.75} borderBottom="1px solid" borderColor="divider">
                    <Typography variant="body2" fontWeight="medium">{b.bookTitle}</Typography>
                    <Typography variant="caption" color="text.secondary">{b.memberName}</Typography>
                  </Box>
                )) : <EmptyState message="Nothing due today" />}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="error.main">Overdue Books</Typography>
                {stats.overdueBooks > 0 ? (
                  <Box textAlign="center" py={2}>
                    <Typography variant="h3" color="error.main" fontWeight="bold">{stats.overdueBooks}</Typography>
                    <Button size="small" sx={{ mt: 1 }} onClick={() => navigate('/borrows')}>View All</Button>
                  </Box>
                ) : <EmptyState message="No overdue books" />}
              </Paper>
            </Grid>

            {statistics && (
              <>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Books by Category</Typography>
                    <CategoryBarChart data={statistics.booksByCategory} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Monthly Borrow Trends</Typography>
                    <TrendLineChart data={statistics.monthlyBorrowTrends} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Member Growth</Typography>
                    <TrendLineChart data={statistics.memberGrowth} label="New Members" />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Borrow vs Return</Typography>
                    <BorrowReturnChart
                      borrowData={statistics.monthlyBorrowTrends}
                      returnData={statistics.monthlyBorrowTrends?.map((b) => ({
                        label: b.label,
                        value: statistics.borrowVsReturn?.find((r) => r.label === `${b.label} Return`)?.value ?? 0,
                      }))}
                    />
                  </Paper>
                </Grid>
              </>
            )}
          </Grid>
        </>
      )}

      {!isStaff && memberSummary && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Borrows" value={memberSummary.activeBorrows} icon={<SwapHorizIcon />} color="primary" onClick={() => navigate('/borrows')} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Overdue" value={memberSummary.overdueBorrows} icon={<WarningIcon />} color="error" onClick={() => navigate('/borrows')} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Pending Fines" value={memberSummary.pendingFines} icon={<MenuBookIcon />} color="warning" onClick={() => navigate('/fines')} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Wishlist Items" value={memberSummary.wishlistCount} icon={<FavoriteIcon />} color="secondary" onClick={() => navigate('/wishlist')} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
