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
    const token = localStorage.getItem("authToken");
    console.log(token);
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        router.push("/");
      } else {
        setError(data.error || "Login failed");
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
        <p className="block text-center">
          If you haven't an account yet,{" "}
          <Link href="/auth/register" className="text-blue-500 translate-x-20">
            register
          </Link>
        </p>
      </div>
    </div>
  );
}
