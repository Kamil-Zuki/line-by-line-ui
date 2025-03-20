import { Box, Flex, Heading, Container } from "@chakra-ui/react";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Flex as="header" bg="teal.500" p={4} color="white" justify="center">
        <Heading size="lg">LineByLine</Heading>
      </Flex>
      <Container maxW="container.md" py={8}>
        {children}
      </Container>
    </Box>
  );
}
