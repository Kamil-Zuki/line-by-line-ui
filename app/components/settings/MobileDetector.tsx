"use client";

import { useBreakpointValue } from "@chakra-ui/react";
import { ReactNode } from "react";

interface MobileDetectorProps {
  children: (isMobile: boolean) => ReactNode;
}

/**
 * Client component for responsive breakpoint detection
 * Isolated Chakra UI hook usage
 */
export default function MobileDetector({ children }: MobileDetectorProps) {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  
  return <>{children(isMobile)}</>;
}

