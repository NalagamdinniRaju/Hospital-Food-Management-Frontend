import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentPath = window.location.pathname.slice(1);
  if (user.role !== currentPath) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

export default PrivateRoute;

