"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SideBar() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <aside className="flex flex-col bg-neutral-800 w-28 h-screen p-4 text-white ml-2">
      <h2 className="text-xl font-bold mb-4">
        <Link href="/" className="block p-2 rounded">
          LBL
        </Link>
      </h2>
      <ul className="space-y-4 text-sm">
        <li>
          <Link href="/deck" className="block hover:bg-stone-700 p-2 rounded">
            Decks
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="block hover:bg-stone-700 p-2 rounded"
          >
            Settings
          </Link>
        </li>
      </ul>
    </aside>
  );
}
