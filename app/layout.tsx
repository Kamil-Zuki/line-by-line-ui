"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
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
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    if (status === "unauthenticated" && !isAuthPage) {
      router.push("/auth/login");
    }
  }, [status, router, isAuthPage]);

  // 🛑 Fix: Prevent redirect loops by waiting for session status
  if (status === "loading") return null;

  return (
    <html lang="en">
      <body>
        {isAuthPage ? (
          <div className="flex h-screen items-center justify-center bg-[#2f3136]">
            {children}
          </div>
        ) : (
          <div className="flex h-screen bg-gray-100 overflow-hidden">
            <SideBar />
            <div className="flex flex-col flex-1 min-h-0">
              <Header />
              <main className="flex-1 overflow-y-auto min-h-0">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
