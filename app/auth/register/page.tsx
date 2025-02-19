"use client";

import { useState, useEffect } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRegister = async () => {
    setError("");
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword }), // No need to send confirmPassword
    });

    const data = await response.json();
    console.log(data);
    setError(data.error);
    setMessage(data.message);
  };

  if (!isMounted) return null;

  return (
    <div className="flex items-center justify-center h-screen bg-[#2f3136]">
      <div className="p-8 bg-gray-900 shadow-md rounded-md w-96 max-w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Register
        </h2>

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
          className="w-full text-black mb-4 p-3 border border-gray-300 rounded focus:outline-none"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full text-black mb-6 p-3 border border-gray-300 rounded focus:outline-none"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 focus:outline-none"
        >
          Register
        </button>

        {message && (
          <p className="text-center mt-4 text-green-600">{message}</p>
        )}
        {error && <p className="text-center mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
