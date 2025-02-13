import Image from "next/image";
import Header from "./components/header";
import SideBar from "./components/sideBar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 bg-white p-6 rounded-xl shadow-md m-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
          <p className="text-gray-700 mb-6">
            This is your main content area. You can add your content here and
            style it as needed.
          </p>
        </main>
      </div>
    </div>
  );
}
