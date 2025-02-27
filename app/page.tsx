import Link from "next/link";

export default function MainPage() {
  return (
    <div className="flex text-black flex-col bg-white text-5xl h-screen justify-center items-center">
      Welcome to LBL service
      <p className="text-lg">
        Pass registration process or login to enjoy your learning journey
      </p>
      <p className="text-lg text-blue-700">
        <Link href="/login">Login link</Link>
      </p>
    </div>
  );
}
