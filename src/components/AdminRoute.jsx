import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLoading } from './admin/AdminUi';

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, authLoading, openAuthModal, isAuthModalOpen } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [hasPrompted, setHasPrompted] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !hasPrompted) {
      openAuthModal('login');
      setHasPrompted(true);
    }
  }, [authLoading, isAuthenticated, hasPrompted, openAuthModal]);

  useEffect(() => {
    if (hasPrompted && !isAuthModalOpen && !isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [hasPrompted, isAuthModalOpen, isAuthenticated, navigate]);

  if (authLoading) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          <AdminLoading label="Checking admin access…" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
