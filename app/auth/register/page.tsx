"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setMessage("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    const data = await response.json();
    setMessage(data.error || data.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2f3136]">
      <div className="p-8 bg-[#40444b] shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Register
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-600 rounded-lg text-white bg-[#2f3136]"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-[#3ba55c] text-white p-3 rounded-lg hover:bg-[#34903f]"
        >
          Register
        </button>

        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
}
