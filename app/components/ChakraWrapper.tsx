"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";
import theme from "../themes/theme";

interface ChakraWrapperProps {
  children: ReactNode;
}

// Sync Chakra UI color mode with next-themes
function ColorModeSync() {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    // Listen for theme changes from next-themes
    const handleThemeChange = () => {
      const theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      setColorMode(theme);
    };

    // Initial sync
    handleThemeChange();

    // Watch for changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [setColorMode]);

  return null;
}

export default function ChakraWrapper({ children }: ChakraWrapperProps) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false}
      disableTransitionOnChange
    >
      <ChakraProvider theme={theme}>
        <ColorModeSync />
        {children}
      </ChakraProvider>
    </ThemeProvider>
  );
}