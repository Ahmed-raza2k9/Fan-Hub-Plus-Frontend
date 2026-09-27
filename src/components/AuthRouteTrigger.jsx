import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthRouteTrigger({ mode }) {
  const { openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    openAuthModal(mode);
    navigate('/', { replace: true });
  }, [mode, openAuthModal, navigate]);

  return null;
}
