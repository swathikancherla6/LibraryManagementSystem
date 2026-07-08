import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List,
  ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useState } from 'react';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { ROLES } from '../../utils/constants';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, roles: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER] },
  { label: 'Books', path: '/books', icon: <MenuBookIcon />, roles: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER] },
  { label: 'Categories', path: '/categories', icon: <CategoryIcon />, roles: [ROLES.ADMIN, ROLES.LIBRARIAN] },
  { label: 'Members', path: '/members', icon: <PeopleIcon />, roles: [ROLES.ADMIN, ROLES.LIBRARIAN] },
  { label: 'Users', path: '/users', icon: <AdminPanelSettingsIcon />, roles: [ROLES.ADMIN] },
  { label: 'Borrows', path: '/borrows', icon: <SwapHorizIcon />, roles: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER] },
  { label: 'Fines', path: '/fines', icon: <AttachMoneyIcon />, roles: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER] },
  { label: 'Wishlist', path: '/wishlist', icon: <FavoriteIcon />, roles: [ROLES.MEMBER] },
  { label: 'Profile', path: '/profile', icon: <PersonIcon />, roles: [ROLES.ADMIN, ROLES.LIBRARIAN, ROLES.MEMBER] },
];

export default function Navbar({ onNavigate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userRoles = user?.roles ? Array.from(user.roles) : [];
  const filteredNav = navItems.filter((item) => item.roles.some((r) => userRoles.includes(r)));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
    onNavigate?.();
  };

  const navList = (
    <List>
      {filteredNav.map((item) => (
        <ListItemButton key={item.path} onClick={() => handleNav(item.path)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
      <ListItemButton onClick={() => dispatch(toggleTheme())}>
        <ListItemIcon>{themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}</ListItemIcon>
        <ListItemText primary={themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
      </ListItemButton>
    </List>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <MenuBookIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Library Management</Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            <Typography variant="body2">{user?.firstName} {user?.lastName}</Typography>
            <IconButton color="inherit" onClick={() => dispatch(toggleTheme())} title="Toggle theme">
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            {filteredNav.map((item) => (
              <Button key={item.path} color="inherit" onClick={() => handleNav(item.path)}>{item.label}</Button>
            ))}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Toolbar />
        {navList}
      </Drawer>
    </>
  );
}
