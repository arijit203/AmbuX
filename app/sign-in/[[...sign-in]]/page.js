'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { SignIn } from '@clerk/nextjs';
import { useRole } from '../../context/RoleContext';

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole } = useRole();

  useEffect(() => {
    // Extract the 'role' parameter from the query string
    const role = searchParams.get('role');

    if (role) {
      setRole(role);
    }
  }, [searchParams, setRole]);

  return (
    <div className=" flex justify-center items-center min-h-screen">
      
      <SignIn />
    </div>
  );
};

export default SignInPage;
