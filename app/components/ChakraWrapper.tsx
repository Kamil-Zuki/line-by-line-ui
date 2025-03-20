"use client";

import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ReactNode } from "react";

// Create an Emotion cache for client-side consistency
const emotionCache = createCache({ key: "css" });

export default function ChakraWrapper({ children }: { children: ReactNode }) {
  return (
    <CacheProvider value={emotionCache}>
      <ChakraProvider>
        <CSSReset />
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
