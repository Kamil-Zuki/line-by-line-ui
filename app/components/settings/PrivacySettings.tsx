"use client";

import { useState } from "react";
import {
  Box,
  Text as ChakraText,
  Card,
  CardBody,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Button,
  useToast,
} from "@chakra-ui/react";

const PrivacySettings = () => {
  const [shareData, setShareData] = useState(false);
  const toast = useToast(); // Use the useToast hook directly

  const showToast = (title: string, description: string, status: "success") => {
    toast({
      position: "top",
      duration: 3000,
      isClosable: true,
      render: ({ onClose }: { onClose: () => void }) => (
        <Box
          bg="gray.800"
          border="2px solid"
          borderColor="blue.900"
          color="white"
          p={4}
          borderRadius="md"
          boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ bg: "gray.700" }}
        >
          <VStack align="start" spacing={1}>
            <ChakraText fontWeight="bold" fontSize="md">{title}</ChakraText>
            <ChakraText fontSize="sm">{description}</ChakraText>
          </VStack>
          <Button size="sm" onClick={onClose} color="white" variant="ghost">
            Close
          </Button>
        </Box>
      ),
    });
  };

  const handleSave = () => {
    showToast("Privacy Settings Updated", "Your privacy settings have been updated.", "success");
  };

  return (
    <Box>
      <ChakraText
        fontSize="20px"
        fontWeight="bold"
        mb={6}
        color="white"
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
      >
        Privacy & Safety
      </ChakraText>
      <Card
        bg="gray.700"
        color="white"
        border="2px solid"
        borderColor="blue.900"
        borderRadius="md"
        boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
        _hover={{ boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)" }}
        transition="all 0.2s"
      >
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel fontSize="sm" color="gray.400" textTransform="uppercase" mb={0}>
                Share Usage Data
              </FormLabel>
              <Switch
                isChecked={shareData}
                onChange={(e) => setShareData(e.target.checked)}
                colorScheme="red"
              />
            </FormControl>
            <Button
              bg="red.800"
              border="2px solid"
              borderColor="blue.900"
              color="white"
              _hover={{
                bg: "red.700",
                boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                transform: "scale(1.02)",
              }}
              _active={{ bg: "red.900" }}
              transition="all 0.2s"
              alignSelf="flex-end"
              onClick={handleSave}
            >
              Save
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default PrivacySettings;