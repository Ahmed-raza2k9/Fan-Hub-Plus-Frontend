import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function GlobalAuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal } = useAuth();
  
  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      initialMode={authModalMode}
    />
  );
}
