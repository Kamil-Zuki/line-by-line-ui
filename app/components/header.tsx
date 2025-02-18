"use client";
import Link from "next/link";
import SearchPanel from "./SearchPanel";

export default function Header() {
  const logout = () => {
    const data = localStorage.getItem("authToken");
    console.log(data);
    localStorage.setItem("authToken", "");
  };

  return (
    <div className="flex items-center justify-between h-16 bg-stone-900 w-full px-4 gap-2">
      <div className="flex-3"></div>
      <SearchPanel />

      <div className="flex-none">
        <Link href="/auth/login">
          <img
            src="/file.svg"
            alt="Logo"
            className="rounded-full w-10 h-10 object-cover cursor-pointer border-2 border-white"
          />
        </Link>
      </div>
      <button
        onClick={logout}
        className="text-pink-50 rounded-xl bg-red-600 box-border p-1 hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
