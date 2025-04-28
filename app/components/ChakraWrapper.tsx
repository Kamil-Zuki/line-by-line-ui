"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import theme from "../themes/theme";

interface ChakraWrapperProps {
  children: ReactNode;
}

export default function ChakraWrapper({ children }: ChakraWrapperProps) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}