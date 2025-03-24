"use client";

import { Box, Container, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";
import Link from "next/link";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Box as="header" bg="teal.500" p={4} color="white" textAlign="center">
        <Heading size="lg">
          <Link href="/">LineByLine</Link>
        </Heading>
      </Box>
      <Container maxW="container.lg" py={8}>
        {children}
      </Container>
    </Box>
  );
}
