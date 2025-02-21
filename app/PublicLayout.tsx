import "./globals.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
