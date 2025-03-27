// Test component
"use client";

import { useEffect } from "react";
import { useApi } from "@/app/lib/api";

export default function TestApi() {
  const api = useApi();

  useEffect(() => {
    const testFetch = async () => {
      try {
        const decks = await api.get<any>("/decks/my-decks");
        console.log("Decks fetched:", decks);
      } catch (error: any) {
        console.error("Test fetch failed:", error.message, {
          status: error.status,
        });
      }
    };
    testFetch();
  }, []);

  return <div>Check console for API test</div>;
}
