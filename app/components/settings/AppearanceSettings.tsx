"use client";

import {
  Box,
  Text as ChakraText,
  Card,
  CardBody,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import ThemeToggle from "../ThemeToggle";

const AppearanceSettings = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <Box>
      <ChakraText
        fontSize="xl"
        fontWeight="semibold"
        mb={4}
        color={textColor}
      >
        Appearance
      </ChakraText>
      <Card
        bg={cardBg}
        border="1px solid"
        borderColor={cardBorder}
        borderRadius="lg"
        boxShadow="sm"
      >
        <CardBody>
          <HStack justify="space-between" align="center">
            <Box>
              <ChakraText fontWeight="semibold" color={textColor}>
                Theme
              </ChakraText>
              <ChakraText fontSize="sm" color={labelColor}>
                Switch between light and dark mode
              </ChakraText>
            </Box>
            <ThemeToggle />
          </HStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default AppearanceSettings;

