"use client";

import { Box, Text, Card, CardBody, HStack, Button } from "@chakra-ui/react";

interface DangerZoneProps {
  onDeleteAccount?: () => void;
}

const DangerZone = ({ onDeleteAccount }: DangerZoneProps) => {
  return (
    <Box>
      <Text fontSize="20px" fontWeight="bold" mb={4} color="red.300">
        Danger Zone
      </Text>
      <Card bg="#383a40" color="white">
        <CardBody>
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="bold" color="white">
                Delete Account
              </Text>
              <Text fontSize="sm" color="whiteAlpha.700">
                Permanently delete your account and all data
              </Text>
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