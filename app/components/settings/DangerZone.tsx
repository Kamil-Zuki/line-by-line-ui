"use client";

import { Box, Text as ChakraText, Card, CardBody, HStack, Button } from "@chakra-ui/react";

interface DangerZoneProps {
  onDeleteAccount?: () => void;
}

const DangerZone = ({ onDeleteAccount }: DangerZoneProps) => {
  return (
    <Box mt={6}>
      <ChakraText
        fontSize="20px"
        fontWeight="bold"
        mb={4}
        color="white"
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
      >
        Danger Zone
      </ChakraText>
      <Card
        bg="gray.700"
        color="white"
        border="2px solid"
        borderColor="red.600"
        borderRadius="md"
        boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
        _hover={{ boxShadow: "0 0 5px rgba(229, 62, 62, 0.3)" }}
        transition="all 0.2s"
      >
        <CardBody>
          <HStack justify="space-between">
            <Box>
              <ChakraText fontWeight="bold" color="white" textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)">
                Delete Account
              </ChakraText>
              <ChakraText fontSize="sm" color="gray.300">
                Permanently delete your account and all data
              </ChakraText>
            </Box>
            <Button
              bg="red.800"
              border="2px solid"
              borderColor="blue.900"
              color="white"
              size="sm"
              _hover={{
                bg: "red.700",
                boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                transform: "scale(1.02)",
              }}
              _active={{ bg: "red.900" }}
              transition="all 0.2s"
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