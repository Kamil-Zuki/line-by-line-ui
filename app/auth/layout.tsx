import AuthProvider from "../components/sessionProvider";
import "../globals.css"; // Ensure global styles are imported

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex h-screen bg-white overflow-hidden">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
