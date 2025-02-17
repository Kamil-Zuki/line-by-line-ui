"use client";
import Link from "next/link";
import SearchPanel from "./searchPanel";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between h-16 bg-stone-900 w-full px-4">
      {/* Spacer for layout */}
      <div className="flex-3"></div>

      {/* Search Panel */}
      <SearchPanel />

      {/* Navigation link based on authentication */}
      <div className="flex-none">
        <Link href={session ? "/profile" : "/auth/login"}>
          <img
            src="/file.svg"
            alt="Logo"
            className="rounded-full w-10 h-10 object-cover cursor-pointer border-2 border-white"
          />
        </Link>
      </div>
    </div>
  );
}
