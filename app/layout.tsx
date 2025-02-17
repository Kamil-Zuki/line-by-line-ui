"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SideBar from "./components/sideBar";
import Header from "./components/header";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthGuard>{children}</AuthGuard>
        </SessionProvider>
      </body>
    </html>
  );
}

// 🔹 AuthGuard to check authentication and handle layout visibility
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login"); // Redirect to login if not authenticated
    }
  }, [status, router]);

  // Prevent flicker while loading session
  if (status === "loading") return null;

  // Hide sidebar & header only for auth pages
  const isAuthPage =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/auth");

  return (
    <div className="flex h-screen">
      {!isAuthPage && <SideBar />}
      <div className="flex flex-col flex-1">
        {!isAuthPage && <Header />}
        <main className="flex-1 overflow-y-auto">{children}</main>{" "}
        {/* Removed padding, margin, bg */}
      </div>
    </div>
  );
}
