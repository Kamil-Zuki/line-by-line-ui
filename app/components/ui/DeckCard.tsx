"use client";

import { Box, Heading, Text, VStack, Badge, HStack, useColorModeValue } from "@chakra-ui/react";
import { DeckResponse } from "@/app/interfaces";

interface DeckCardProps {
  deck: DeckResponse;
  onClick: () => void;
  "aria-label": string;
}

export function DeckCard({
  deck,
  onClick,
  "aria-label": ariaLabel,
}: DeckCardProps) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const hoverBorderColor = "brand.500";

  return (
    <Box
      as="button"
      onClick={onClick}
      aria-label={ariaLabel}
      bg={bgColor}
      p={5}
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      width={{ base: "100%", sm: "300px" }}
      minHeight="180px"
      borderRadius="lg"
      _hover={{
        boxShadow: "md",
        borderColor: hoverBorderColor,
        transform: "translateY(-2px)",
      }}
      _focus={{
        outline: "none",
        boxShadow: "outline",
      }}
      transition="all 0.2s"
      textAlign="left"
    >
      <VStack
        align="start"
        spacing={3}
        height="100%"
      >
        <Heading
          as="h3"
          size="md"
          color={headingColor}
          noOfLines={2}
        >
          {deck.title}
        </Heading>
        <Text
          fontSize="sm"
          color={textColor}
          noOfLines={2}
          flex="1"
        >
          {deck.description || "No description available."}
        </Text>
        <HStack spacing={2}>
          <Badge colorScheme="blue" borderRadius="md">
            {deck.cardCount} cards
          </Badge>
          <Badge colorScheme="green" borderRadius="md">
            {deck.subscriberCount} subs
          </Badge>
        </HStack>
      </VStack>
    </Box>
  );
}
