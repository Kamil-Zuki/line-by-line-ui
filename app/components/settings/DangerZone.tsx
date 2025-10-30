"use client";

import { Box, Text as ChakraText, Card, CardBody, HStack, Button, useColorModeValue } from "@chakra-ui/react";

interface DangerZoneProps {
  onDeleteAccount?: () => void;
}

const DangerZone = ({ onDeleteAccount }: DangerZoneProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const descColor = useColorModeValue("gray.600", "gray.400");
  const dangerBorder = useColorModeValue("red.200", "red.900");

  return (
    <Box mt={6}>
      <ChakraText
        fontSize="xl"
        fontWeight="semibold"
        mb={4}
        color={textColor}
      >
        Danger Zone
      </ChakraText>
      <Card
        bg={cardBg}
        border="1px solid"
        borderColor={dangerBorder}
        borderRadius="lg"
        boxShadow="sm"
      >
        <CardBody>
          <HStack justify="space-between" align="center">
            <Box>
              <ChakraText fontWeight="semibold" color={textColor}>
                Delete Account
              </ChakraText>
              <ChakraText fontSize="sm" color={descColor}>
                Permanently delete your account and all data
              </ChakraText>
            </Box>
            <Button
              colorScheme="red"
              size="sm"
              onClick={onDeleteAccount}
            >
              Delete
            </Button>
          </HStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default DangerZone;