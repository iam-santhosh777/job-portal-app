'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePageMetadata } from '@/hooks/usePageMetadata';

export default function UserDashboardPage() {
  const router = useRouter();
  
  usePageMetadata({
    title: 'User Dashboard',
    description: 'Your personal dashboard for browsing and applying to available job positions.',
  });
  
  useEffect(() => {
    router.replace('/user/jobs');
  }, [router]);
  
  return null;
}

