"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text as ChakraText,
  Button,
  useToast,
  Spinner,
  VStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { UserSettingsDto, UpdateUserSettingsRequestDto, LearningMode } from "@/app/interfaces";
import { fetchApi } from "@/app/lib/api"

export default function SettingsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<UserSettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState<UpdateUserSettingsRequestDto>({
    dailyNewCardLimit: 10,
    dailyReviewLimit: 20,
    rolloverHour: 4,
    preferredMode: LearningMode.Review,
  });
  const router = useRouter();
  const toast = useToast();

  // Custom toast renderer for Ultimate Spider-Man style
  const showToast = (
    title: string,
    description: string,
    status: "success" | "error"
  ) => {
    toast({
      position: "top",
      duration: 3000,
      isClosable: true,
      render: ({ onClose }) => (
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
            <Heading as="h3" size="sm" color="white">
              {title}
            </Heading>
            <ChakraText fontSize="sm">{description}</ChakraText>
          </VStack>
          <Button size="sm" variant="ghost" color="white" onClick={onClose}>
            Close
          </Button>
        </Box>
      ),
    });
  };

  // Fetch user settings on page load
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const loadSettings = async () => {
      setIsLoading(true);
      try {
        console.log("Try to load settings")
        const response = await fetchApi<UserSettingsDto>("/settings", { method: "GET" });
        setSettings(response);
        setFormValues({
          dailyNewCardLimit: response.dailyNewCardLimit,
          dailyReviewLimit: response.dailyReviewLimit,
          rolloverHour: response.rolloverHour,
          preferredMode: response.preferredMode,
        });
      } catch (error: any) {
        console.error("Error fetching settings:", error.message, {
          status: error.status,
        });
        showToast("Error", "Failed to load settings. Please try again.", "error");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated, authLoading, router]);

  // Handle form submission
  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = await fetchApi<UserSettingsDto>("/settings", {
        method: "PUT",
        body: JSON.stringify(formValues),
      });
      setSettings(updatedSettings);
      showToast("Success", "Settings updated successfully!", "success");
    } catch (error: any) {
      console.error("Error updating settings:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to update settings. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Authentication and loading states
  if (authLoading || isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner
          size="xl"
          color="white"
          thickness="3px"
          speed="0.65s"
          _hover={{ filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))" }}
        />
      </Box>
    );
  }

  if (!isAuthenticated) {
    showToast("Error", "Please log in to access this page.", "error");
    router.push("/login");
    return null;
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <VStack spacing={6} align="stretch" maxW="600px" w="100%">
        <Heading
          as="h1"
          size={{ base: "lg", md: "xl" }}
          color="white"
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
          textAlign="center"
        >
          Settings
        </Heading>

        <Box
          bg="gray.700"
          border="2px solid"
          borderColor="blue.900"
          borderRadius="md"
          boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
          p={6}
        >
          <VStack spacing={4} align="stretch">
            {/* Daily New Card Limit */}
            <FormControl>
              <FormLabel color="white">Daily New Card Limit</FormLabel>
              <NumberInput
                min={0}
                value={formValues.dailyNewCardLimit}
                onChange={(valueString) =>
                  setFormValues({
                    ...formValues,
                    dailyNewCardLimit: parseInt(valueString) || 0,
                  })
                }
              >
                <NumberInputField bg="gray.600" color="white" />
              </NumberInput>
              <ChakraText fontSize="sm" color="gray.300" mt={1}>
                Number of new cards you can learn each day (Current: {settings?.newCardsCompletedToday} learned today)
              </ChakraText>
            </FormControl>

            {/* Daily Review Limit */}
            <FormControl>
              <FormLabel color="white">Daily Review Limit</FormLabel>
              <NumberInput
                min={0}
                value={formValues.dailyReviewLimit}
                onChange={(valueString) =>
                  setFormValues({
                    ...formValues,
                    dailyReviewLimit: parseInt(valueString) || 0,
                  })
                }
              >
                <NumberInputField bg="gray.600" color="white" />
              </NumberInput>
              <ChakraText fontSize="sm" color="gray.300" mt={1}>
                Number of review cards you can study each day (Current: {settings?.reviewsCompletedToday} reviewed today)
              </ChakraText>
            </FormControl>

            {/* Rollover Hour */}
            <FormControl>
              <FormLabel color="white">Rollover Hour (UTC)</FormLabel>
              <NumberInput
                min={0}
                max={23}
                value={formValues.rolloverHour}
                onChange={(valueString) =>
                  setFormValues({
                    ...formValues,
                    rolloverHour: parseInt(valueString) || 0,
                  })
                }
              >
                <NumberInputField bg="gray.600" color="white" />
              </NumberInput>
              <ChakraText fontSize="sm" color="gray.300" mt={1}>
                The hour (in UTC) when daily limits reset (0-23)
              </ChakraText>
            </FormControl>

            {/* Preferred Mode */}
            <FormControl>
              <FormLabel color="white">Preferred Learning Mode</FormLabel>
              <Select
                bg="gray.600"
                color="white"
                value={formValues.preferredMode}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    preferredMode: e.target.value as LearningMode,
                  })
                }
              >
                <option value={LearningMode.Learn}>Learn</option>
                <option value={LearningMode.Review}>Review</option>
                <option value={LearningMode.Cram}>Cram</option>
              </Select>
              <ChakraText fontSize="sm" color="gray.300" mt={1}>
                Default mode for study sessions
              </ChakraText>
            </FormControl>

            {/* Save Button */}
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
              isLoading={isSaving}
              onClick={handleSubmit}
            >
              Save Settings
            </Button>

            {/* Back to Dashboard Button */}
            <Button
              variant="outline"
              borderColor="blue.900"
              color="white"
              _hover={{
                bg: "gray.600",
                boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
              }}
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}