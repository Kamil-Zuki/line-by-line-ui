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
          margin: 0,
          background: "gray.900",
        }}
      >
        {/* Subtle cityscape gradient and web accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, rgba(255, 255, 255, 0.05), transparent)",
            opacity: 0.3,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Web thread accent */}
        <div
          style={{
            position: "absolute",
            top: "-2px",
            left: "5%",
            width: "60px",
            height: "2px",
            background: "white",
            boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)", // Soft white glow
            transform: "rotate(-45deg)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        {/* Main border with comic-book style */}
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: "-4px",
            right: "-4px",
            bottom: "-4px",
            border: "4px solid",
            borderColor: "blue.900",
            boxShadow: "0 0 5px rgba(66, 153, 225, 0.3), inset 0 0 5px rgba(0, 0, 0, 0.5)", // Soft blue glow + inner shadow
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <ChakraWrapper>{children}</ChakraWrapper>
      </body>
    </html>
  );
}