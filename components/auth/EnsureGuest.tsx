'use client';

import { useLayoutEffect, useState } from "react";
import { decryptToken } from "@/utils/protect";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/loading";

export const ensureGuest = (WrappedComponent: any) => {
  return function EnsureGuest(props: any) {
    const [isGuest, setIsGuest] = useState<boolean | null>(null);
    const router = useRouter();

    // Check if user is authenticated
    useLayoutEffect(() => {
      const verifyGuest = async () => {
        const token = await decryptToken();
        if (token) {
          // Redirect logged-in user to dashboard
          router.push("/dashboard");
        } else {
          setIsGuest(true);
        }
      };

      verifyGuest();
    }, [router]);

    if (isGuest === null) {
      return <LoadingPage />; // Show loading while checking guest status
    }

    if (!isGuest) {
      return null; // Prevent component render if not a guest
    }

    return <WrappedComponent {...props} />;
  };
};
