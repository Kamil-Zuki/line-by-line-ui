"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="eng">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    // if (status === "unauthenticated" && !isAuthPage) {
    //   router.push("/auth/login");
    // }
  }, [router, isAuthPage]);

  return (
    <>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <SideBar />
        <div className="flex flex-col flex-1 min-h-0">
          <Header />
          <main className="flex-1 overflow-y-auto min-h-0">{children}</main>
        </div>
      </div>
    </>
  );
}
