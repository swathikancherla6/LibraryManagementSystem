import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ROLES } from '../utils/constants';

/** Shared role helpers — avoids duplicating Array.from(user.roles) across pages. */
export default function useAuth() {
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  return useMemo(() => {
    const roles = user?.roles ? Array.from(user.roles) : [];
    return {
      user,
      roles,
      isAuthenticated,
      loading,
      error,
      isAdmin: roles.includes(ROLES.ADMIN),
      isLibrarian: roles.includes(ROLES.LIBRARIAN),
      isMember: roles.includes(ROLES.MEMBER),
      isStaff: roles.includes(ROLES.ADMIN) || roles.includes(ROLES.LIBRARIAN),
      canManage: roles.includes(ROLES.ADMIN) || roles.includes(ROLES.LIBRARIAN),
    };
  }, [user, isAuthenticated, loading, error]);
}
