export default function SideBar() {
  return (
    <aside className="flex flex-col bg-stone-800 w-64 h-screen p-4 text-white">
      <h2 className="text-xl font-bold mb-4">SideBar</h2>
      <ul className="space-y-4">
        <li className="hover:bg-stone-700 p-2 rounded">Dashboard</li>
        <li className="hover:bg-stone-700 p-2 rounded">Settings</li>
        <li className="hover:bg-stone-700 p-2 rounded">Profile</li>
        <li className="hover:bg-stone-700 p-2 rounded">Logout</li>
      </ul>
    </aside>
  );
}
