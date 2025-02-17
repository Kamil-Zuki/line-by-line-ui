import AuthProvider from "../components/sessionProvider";
import "../globals.css"; // Ensure global styles are imported

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#2f3136]">
        <AuthProvider>
          <div className="flex h-screen items-center justify-center bg-[#2f3136]">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
