"use client";

import { IconButton, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // All hooks must be called before any conditional returns
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const hoverBgColor = useColorModeValue("gray.200", "gray.600");

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Early return for SSR - but hooks are already called above
  if (!mounted) {
    return (
      <IconButton
        aria-label="Toggle theme"
        icon={<FaSun />}
        size="md"
        variant="ghost"
        isDisabled
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <Tooltip label={isDark ? "Switch to light mode" : "Switch to dark mode"} placement="right">
      <IconButton
        aria-label="Toggle theme"
        icon={isDark ? <FaSun /> : <FaMoon />}
        onClick={toggleTheme}
        size="md"
        variant="ghost"
        bg={bgColor}
        _hover={{ bg: hoverBgColor }}
        transition="all 0.2s"
      />
    </Tooltip>
  );
}

