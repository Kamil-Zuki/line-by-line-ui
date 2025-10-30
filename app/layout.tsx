import { ReactNode } from "react";
import ChakraWrapper from "./components/ChakraWrapper";

export const metadata = {
  title: "LineByLine",
  description: "A gamified language learning platform",
  icons: {
    icon: "/logo-linebyline.svg",
    shortcut: "/logo-linebyline.svg",
    apple: "/logo-linebyline.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ChakraWrapper>{children}</ChakraWrapper>
      </body>
    </html>
  );
}