import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const RequireVisitor = () => {
  const { user, login } = useCurrentUserContext();
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      login(token);
    }
  }, [location.search]);

  if (!user) {
    return <Outlet />;
  }

  return <Navigate to='/' replace />;
};

export default RequireVisitor;
