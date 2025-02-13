// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex items-center justify-between h-16 bg-stone-900 w-full px-4">
      <div className="flex-3"></div>

      <div className="flex justify-center w-1/3 min-w-64">
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-8 p-2 rounded-full bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-none">
        <Link href="/profile">
          <img
            src="../public/file.svg"
            alt="Logo"
            className="rounded-full w-10 h-10 object-cover cursor-pointer border-2 border-white"
          />
        </Link>
      </div>
    </div>
  );
}
