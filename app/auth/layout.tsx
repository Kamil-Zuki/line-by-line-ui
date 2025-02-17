// In your auth layout for login/register pages

import AuthProvider from "../components/authProvider"; // Import the AuthProvider

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children} {/* Render children here */}
    </AuthProvider>
  );
}
