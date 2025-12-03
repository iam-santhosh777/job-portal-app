import { useEffect } from 'react';

interface PageMetadata {
  title: string;
  description: string;
}

/**
 * Hook to set page title and meta description
 * Works with client components in Next.js App Router
 */
export const usePageMetadata = ({ title, description }: PageMetadata) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Update or create meta description tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Cleanup function to restore default title on unmount
    return () => {
      document.title = 'Job Portal - Find Your Dream Job';
    };
  }, [title, description]);
};

