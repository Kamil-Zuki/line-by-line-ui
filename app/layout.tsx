import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";

export const metadata = {
  title: "LineByLine",
  description: "A gamified language learning platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
