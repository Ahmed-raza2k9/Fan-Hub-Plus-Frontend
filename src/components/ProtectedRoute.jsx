import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute() {
  const { isAuthenticated, authLoading, openAuthModal, isAuthModalOpen } = useAuth();
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
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
}
