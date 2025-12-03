'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePageMetadata } from '@/hooks/usePageMetadata';

export default function HomePage() {
  const router = useRouter();
  
  usePageMetadata({
    title: 'Job Portal - Find Your Dream Job',
    description: 'Connect job seekers with employers. Browse available positions and apply today.',
  });
  
  useEffect(() => {
    router.replace('/login');
  }, [router]);
  
  return null;
}

