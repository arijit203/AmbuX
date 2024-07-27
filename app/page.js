// app/page.js

'use client';

import { useAuth } from "@clerk/nextjs";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Home from './patient/Home';

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  if (!isSignedIn) {
    return null; // Prevent rendering if the user is not signed in
  }

  return <Home />;
}
