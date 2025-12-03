'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user && user.role !== 'user') {
        router.replace('/hr/dashboard');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !isAuthenticated || (user && user.role !== 'user')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}

