"use client";

import { Box, Text, Card, CardBody, VStack } from "@chakra-ui/react";

const NotificationSettings = () => {
  return (
    <Box>
      <Text fontSize="20px" fontWeight="bold" mb={6} color="white">
        Notifications
      </Text>
      <Card bg="#383a40" color="white">
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Text color="whiteAlpha.800">
              Notification settings content will go here...
            </Text>
            {/* Add actual notification controls here */}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default NotificationSettings;    