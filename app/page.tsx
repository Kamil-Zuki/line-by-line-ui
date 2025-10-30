import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import HomePageClient from "./HomePageClient";

/**
 * Main Landing Page - Server Component
 * 
 * Next.js 15 Optimizations:
 * - Server-side authentication check
 * - Zero client JavaScript for static content
 * - Automatic redirect for authenticated users
 * - Suspense for loading states
 * 
 * @see https://nextjs.org/docs/app/building-your-application/rendering/server-components
 */

export default async function MainPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const isAuthenticated = !!accessToken;

  // Server-side redirect - no client JavaScript needed
  if (isAuthenticated) {
    redirect("/dashboard/decks");
  }

  return (
    <Suspense fallback={null}>
      <HomePageClient />
    </Suspense>
  );
}

// Metadata for SEO
export const metadata = {
  title: "LineByLine - Gamified Language Learning",
  description: "Learn languages through gamified decks, collaboration, and AI-powered progress tracking. Start your language journey today.",
  keywords: ["language learning", "flashcards", "spaced repetition", "gamification"],
  openGraph: {
    title: "LineByLine - Gamified Language Learning",
    description: "Learn languages through gamified decks, collaboration, and AI-powered progress tracking.",
    type: "website",
  },
};