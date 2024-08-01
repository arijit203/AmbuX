'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize state

    useEffect(() => {
      // Check if localStorage is available (i.e., client-side)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/driver'); // Redirect to the login page if no token
        } else {
          setIsAuthenticated(true);
        }
      }
    }, [router]);

    // Render nothing or a loading spinner while checking authentication
    if (isAuthenticated === null) {
      return <div>Loading...</div>; // or a spinner component
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
