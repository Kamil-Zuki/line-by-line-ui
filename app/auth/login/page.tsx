// app/auth/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted before rendering to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent rendering before the component is mounted

  // Handle login process
  const handleLogin = async () => {
    setMessage("");

    // Basic validation
    if (!email || !password) {
      setMessage("Both email and password are required.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          // Ensure localStorage is used only on the client
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
          }
          setMessage("Login successful!");
          setTimeout(() => router.push("/profile"), 1000);
        } else {
          setMessage("Login failed. Please check your credentials.");
        }
      } else {
        setMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2f3136]">
      <div className="p-8 bg-gray-900 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-gray-900"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Login
        </button>

        {/* Error or success message */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("failed") || message.includes("error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Redirect to Register Page */}
        <div className="mt-4 text-center">
          <p className="text-white">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-blue-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
