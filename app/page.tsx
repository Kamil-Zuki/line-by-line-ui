import AuthenticatedLayout from "./AuthenticatedLayout";

export default function Home() {
  return (
    <AuthenticatedLayout>
      <div className="text-white">Text</div>
    </AuthenticatedLayout>
  );
}
