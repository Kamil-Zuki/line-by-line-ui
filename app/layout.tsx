import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./components/sideBar";
import Header from "./components/header";
import HorizontNav from "./components/horizonNav";
import AuthProvider from "./components/sessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Line By Line",
  description: "Deck and Cards",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Ensure full-screen height */}
          <div className="flex h-screen bg-white">
            {/* Sidebar takes full height */}
            <SideBar />

            {/* This wrapper makes sure everything fills height */}
            <div className="flex flex-col flex-1 h-full">
              <Header />
              <main className="flex-1 bg-white p-4 rounded-xl shadow-md m-4 overflow-y-auto">
                {/* <HorizontNav /> */}
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
