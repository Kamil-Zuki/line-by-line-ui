// components/SideBar.tsx
import Link from "next/link";

export default function SideBar() {
  return (
    <aside className="flex flex-col bg-stone-900 w-28 h-screen p-4 text-white">
      <h2 className="text-xl font-bold mb-4">
        <Link href="/" className="block p-2 rounded">
          SideBar
        </Link>
      </h2>
      <ul className="space-y-4">
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
