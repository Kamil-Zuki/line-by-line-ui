"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

// Define the Dark Age Comic Art theme
const theme = extendTheme({
  // Global styles
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "white",
        fontFamily: "heading",
        lineHeight: "base",
      },
      "*": {
        borderColor: "white",
      },
    },
  },
  colors: {
    brand: {
      primary: "red.600",
      secondary: "blue.500",
      tertiary: "green.500",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "extrabold",
        textTransform: "uppercase",
        borderRadius: "0",
        border: "2px solid",
        borderColor: "white",
        _hover: {
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
        },
      },
      variants: {
        solid: {
          bg: "brand.primary",
          color: "white",
          _hover: {
            bg: "red.700",
            boxShadow: "0 0 10px rgba(229, 62, 62, 0.7)",
          },
        },
        outline: {
          borderColor: "brand.secondary",
          color: "brand.secondary",
          _hover: {
            bg: "brand.secondary",
            color: "white",
            boxShadow: "0 0 10px rgba(49, 130, 206, 0.7)",
          },
        },
      },
    },
    Text: {
      baseStyle: {
        fontWeight: "bold",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "extrabold",
        textTransform: "uppercase",
        letterSpacing: "wide",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: "gray.700",
          color: "white",
          borderColor: "white",
          borderRadius: "0",
          borderWidth: "2px",
          _placeholder: {
            color: "gray.400",
          },
          _focus: {
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px blue.500",
          },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: "sm",
        fontWeight: "extrabold",
        color: "gray.400",
        textTransform: "uppercase",
      },
    },
  },
});

interface ChakraWrapperProps {
  children: ReactNode;
}

export default function ChakraWrapper({ children }: ChakraWrapperProps) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}