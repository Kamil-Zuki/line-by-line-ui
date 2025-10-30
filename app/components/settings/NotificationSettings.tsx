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
  useColorModeValue,
} from "@chakra-ui/react";

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

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
    showToast("Notification Settings Updated", "Your notification settings have been updated.", "success");
  };

  return (
    <Box>
      <ChakraText
        fontSize="20px"
        fontWeight="bold"
        mb={6}
        color={textColor}
      >
        Notifications
      </ChakraText>
      <Card
        bg={cardBg}
        color={textColor}
        border="1px solid"
        borderColor={cardBorder}
        borderRadius="lg"
        boxShadow="sm"
      >
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel fontSize="sm" color={labelColor} textTransform="uppercase" mb={0}>
                Email Notifications
              </FormLabel>
              <Switch
                isChecked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                colorScheme="brand"
              />
            </FormControl>
            <Button
              colorScheme="brand"
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

export default NotificationSettings;