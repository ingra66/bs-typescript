import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserProfile } from '@/components/auth/UserProfile';

export const Profile: React.FC = () => {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
}; 