import { ReactNode } from "react";
import ChakraWrapper from "./components/ChakraWrapper";

export const metadata = {
  title: "LineByLine",
  description: "A gamified language learning platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          minHeight: "100vh",
          position: "relative",
          border: "4px solid white",
          margin: 0,
          boxShadow: "0 0 15px rgba(229, 62, 62, 0.5)", // Red glow for dramatic effect
          background: "gray.900",
        }}
      >
        {/* Add a jagged ink splatter effect around the edges */}
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: "-4px",
            right: "-4px",
            bottom: "-4px",
            border: "2px solid",
            borderColor: "red.600",
            pointerEvents: "none", // Ensure the border doesn't interfere with interactions
            boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.8)", // Inner shadow for depth
          }}
        />
        <ChakraWrapper>{children}</ChakraWrapper>
      </body>
    </html>
  );
}