import Link from "next/link";
import SearchPanel from "./SearchPanel";

export default function Header() {
  return (
    <div className="flex items-center justify-between h-12 bg-neutral-800 w-full px-4 gap-4">
      <div className="flex-3"></div>
      <SearchPanel />

      <div className="flex-none">
        <Link href="/login">
          <img
            src="/ml.jpg"
            alt="Logo"
            className="rounded-full w-10 h-10 object-cover cursor-pointer border-2 border-white"
          />
        </Link>
      </div>
      <button className="text-pink-50 rounded-xl bg-red-600 py-1 px-3 hover:bg-red-700">
        Quit
      </button>
    </div>
  );
}
