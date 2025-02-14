// components/Header.tsx
import Link from "next/link";
import SearchPanel from "./searchPanel";

export default function Header() {
  return (
    <div className="flex items-center justify-between h-16 bg-stone-900 w-full px-4">
      <div className="flex-3"></div>

      <SearchPanel />

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
