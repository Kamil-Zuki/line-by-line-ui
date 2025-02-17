"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
      <div className="p-8 bg-[#40444b] shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-600 rounded-lg text-white bg-[#2f3136]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-600 rounded-lg text-white bg-[#2f3136]"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#5865f2] text-white p-3 rounded-lg hover:bg-[#4752c4]"
        >
          Login
        </button>

        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
}
