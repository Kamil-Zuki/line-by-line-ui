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

  // Ensure the component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent hydration mismatch

  const handleLogin = async () => {
    setMessage("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setMessage("Login successful!");
      setTimeout(() => router.push("/profile"), 1000);
    } else {
      setMessage(data.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2f3136]">
      <div className="p-8 bg-gray-900 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Login
        </button>

        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
