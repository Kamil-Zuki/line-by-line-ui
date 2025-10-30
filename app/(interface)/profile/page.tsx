import { Suspense } from "react";
import { Spinner, Flex } from "@chakra-ui/react";
import ProfilePageClient from "./ProfilePageClient";

/**
 * Profile Settings Page - Server Component
 * 
 * Next.js 15 Optimization:
 * - Server Component by default (no "use client")
 * - Suspense boundary for loading states
 * - Client components isolated to leaf nodes
 * - Improved SEO and performance
 * 
 * @see https://nextjs.org/docs/app/building-your-application/rendering/server-components
 */

// Loading component for Suspense boundary
function ProfileLoading() {
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Spinner size="xl" thickness="4px" />
    </Flex>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfilePageClient />
    </Suspense>
  );
}

// Metadata for SEO optimization
export const metadata = {
  title: "Profile Settings | LineByLine",
  description: "Manage your account settings, appearance, privacy, and notifications",
};