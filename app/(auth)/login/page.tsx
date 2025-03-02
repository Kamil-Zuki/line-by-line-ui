"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("/api/auth/token", {
          credentials: "include", // Ensures cookies are included
        });

        if (response.ok) {
          router.push("/dashboard"); // Redirect to home if already authenticated
        }
      } catch (err) {
        console.error("Error checking auth:", err);
      }
    };

    checkToken();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    setError(""); // Reset error message on each attempt

    if (!email || !password) {
      setError("Please provide both email and password.");
      setLoading(false);
      return; // Prevent sending request if fields are empty
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies in request
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        router.push("/dashboard"); // Redirect to home after successful login
      } else {
        setError(data.error || "Login failed"); // Display error if login fails
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#2f3136]">
      <div className="p-8 bg-gray-900 shadow-md rounded-md w-96 max-w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-black mb-4 p-3 border border-gray-300 rounded focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-black mb-6 p-3 border border-gray-300 rounded focus:outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-white block text-center mt-4">
          If you don't have an account yet,{" "}
          <Link href="/auth/register" className="text-blue-500">
            register
          </Link>
        </p>
      </div>
    </div>
  );
}
