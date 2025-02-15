"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth"); // Redirect to login if no token
      return;
    }

    // Simulate fetching user info (you should replace this with an API call)
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        setUser({ email: data.email });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth"); // Redirect to login page
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {user ? (
          <>
            <p className="mb-4">Welcome, <strong>{user.email}</strong></p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 w-full"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-red-500">Error fetching profile</p>
        )}
      </div>
    </div>
  );
}
