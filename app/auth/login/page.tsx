"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // If session is available, redirect to home
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogin = async () => {
    const result = await signIn("credentials", {
      redirect: false, // Prevent next-auth from redirecting itself
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/"); // Redirect after successful login
    }
  };

  if (status === "loading") return null; // Prevent flickering

  return (
    <div className="flex h-screen items-center justify-center bg-[#2f3136]">
      <div className="p-8 bg-gray-900 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-black mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-ful text-black mb-4 p-2 border border-gray-300 rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
