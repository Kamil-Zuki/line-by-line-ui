// /components/AuthProvider.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If not authenticated, redirect to the login page
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/auth/login"); // Redirect to login page
    return null;
  }

  return <>{children}</>;
}
