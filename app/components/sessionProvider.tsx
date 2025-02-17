"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

// If you need to protect pages, use this component:
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect only after render
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return <>{children}</>;
}
