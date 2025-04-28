import { ReactNode } from "react";
import ChakraWrapper from "./components/ChakraWrapper";
import styles from "./layout.module.css";

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
      <body className={styles.bodyWrapper}>
        {/* Decorative Elements */}
        <div
          className={styles.cityscapeGradient}
          aria-hidden="true" // Mark as decorative for screen readers
        />
        <div
          className={styles.webThread}
          aria-hidden="true" // Mark as decorative for screen readers
        />
        <div
          className={styles.comicBorder}
          aria-hidden="true" // Mark as decorative for screen readers
        />
        <ChakraWrapper>{children}</ChakraWrapper>
      </body>
    </html>
  );
}