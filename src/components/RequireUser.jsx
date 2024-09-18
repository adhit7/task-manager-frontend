import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const RequireUser = () => {
  const { user } = useCurrentUserContext();

  if (user) {
    return <Outlet />;
  }

  return <Navigate to='/login' replace />;
};

export default RequireUser;
