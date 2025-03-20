import { ReactNode } from "react";
import ChakraWrapper from "./components/ChakraWrapper";

export const metadata = {
  title: "LineByLine",
  description: "A gamified language learning platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraWrapper>{children}</ChakraWrapper>
      </body>
    </html>
  );
}
