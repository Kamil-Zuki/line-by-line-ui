import "./globals.css";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen max-w-[2574px] m-auto bg-neutral-900 overflow-hidden">
      <SideBar />
      <div className="flex flex-col flex-1 min-h-0">
        <Header />
        <main className="flex-1 bg-neutral-800 overflow-y-auto min-h-0 m-3 p-5 rounded-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
