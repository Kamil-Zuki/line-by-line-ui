import Breadcrumbs from "../components/Breadcrumbs";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "../globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen max-w-[2574px] m-auto bg-neutral-900 overflow-hidden">
      <SideBar />
      <div className="flex flex-col flex-1 min-h-0">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 bg-neutral-800 overflow-y-auto min-h-0 mx-3 my-0 p-5 rounded-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
