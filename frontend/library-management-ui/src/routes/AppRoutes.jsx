import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute, { ROLES } from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import BookListPage from '../pages/books/BookListPage';
import BookDetailPage from '../pages/books/BookDetailPage';
import BookFormPage from '../pages/books/BookFormPage';
import CategoryListPage from '../pages/categories/CategoryListPage';
import MemberListPage from '../pages/members/MemberListPage';
import MemberDetailPage from '../pages/members/MemberDetailPage';
import BorrowListPage from '../pages/borrows/BorrowListPage';
import FineListPage from '../pages/fines/FineListPage';
import WishlistPage from '../pages/wishlist/WishlistPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/profile/ProfilePage';
import UserListPage from '../pages/users/UserListPage';

function Layout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/books" element={<Layout><BookListPage /></Layout>} />
        <Route path="/books/:id" element={<Layout><BookDetailPage /></Layout>} />
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.LIBRARIAN]} />}>
          <Route path="/books/new" element={<Layout><BookFormPage /></Layout>} />
          <Route path="/books/:id/edit" element={<Layout><BookFormPage /></Layout>} />
          <Route path="/categories" element={<Layout><CategoryListPage /></Layout>} />
          <Route path="/members" element={<Layout><MemberListPage /></Layout>} />
          <Route path="/members/:id" element={<Layout><MemberDetailPage /></Layout>} />
        </Route>
        <Route path="/borrows" element={<Layout><BorrowListPage /></Layout>} />
        <Route path="/fines" element={<Layout><FineListPage /></Layout>} />
        <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/users" element={<Layout><UserListPage /></Layout>} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={[ROLES.MEMBER]} />}>
          <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
    </Routes>
  );
}
