import "./globals.css";
import AuthGuard from "./components/AuthGuard";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="eng">
      <body>
        <div className="flex h-screen bg-gray-100 overflow-hidden">
          <SideBar />
          <div className="flex flex-col flex-1 min-h-0">
            <Header />
            <main className="flex-1 overflow-y-auto min-h-0">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
