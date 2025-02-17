"use client"; // Mark this file as a client component

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // This hook will now work
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
        {/* Wrap the entire layout with SessionProvider */}
        <SessionProvider>
          <div className="flex h-screen bg-white overflow-hidden">
            <SideBar />
            <div className="flex flex-col flex-1 min-h-0">
              <Header />
              <main className="flex-1 bg-white p-4 rounded-xl shadow-md m-4 overflow-y-auto min-h-0">
                {children}
              </main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
