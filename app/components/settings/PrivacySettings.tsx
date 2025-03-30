"use client";

import { Box, Text, Card, CardBody, VStack } from "@chakra-ui/react";

const PrivacySettings = () => {
  return (
    <Box>
      <Text fontSize="20px" fontWeight="bold" mb={6} color="white">
        Privacy & Safety
      </Text>
      <Card bg="#383a40" color="white">
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Text color="whiteAlpha.800">
              Privacy settings content will go here...
            </Text>
            {/* Add actual privacy controls here */}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default PrivacySettings;