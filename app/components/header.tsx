// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex items-center justify-between h-16 bg-stone-800 w-full px-4">
      {/* Left side: Empty space to push search bar to the center */}
      <div className="flex-3"></div>

      {/* Centered Search Bar (1/4 of the header width) */}
      <div className="flex justify-center w-1/4 min-w-64">
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-8 p-2 rounded-full bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right side: Avatar (Circular Logo) */}
      <div className="flex-none">
        <Link href="/profile">
          <img
            src="../public/file.svg" // Replace with your logo's URL
            alt="Logo"
            className="rounded-full w-10 h-10 object-cover cursor-pointer border-2 border-white"
          />
        </Link>
      </div>
    </div>
  );
}
