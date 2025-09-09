'use client';
import { useLayoutEffect, useState, useEffect } from "react";
import { decryptToken, clearToken } from "@/utils/protect";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/loading";


export const withAuth = (WrappedComponent: any) => {
  return function WithAuth(props: any) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    // Verify session and authenticate user
    useLayoutEffect(() => {
      const verifySession = async () => {
        const token = await decryptToken();
        if (!token) {
          // Redirect to login with error message
          const status = "error";
          const title = "Oops!";
          const message = "Please log in to continue.";
          const url = `/?status=${encodeURIComponent(status)}&title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}`;

          router.push(url);
        } else {
          setIsAuthenticated(true);
        }
      };
      verifySession();
    }, [router]);

    useEffect(() => {
      const profile = localStorage.getItem('profile');
      if (!profile) {
        clearToken();
       setIsAuthenticated(false);
      }
    }, []);

    if (isAuthenticated === null) {
      return <LoadingPage />; // Show loading while authentication status is checking
    }

    if (!isAuthenticated) {
      return null; // Prevent component render if unauthenticated
    }

    return <WrappedComponent {...props} />;
  };
};
