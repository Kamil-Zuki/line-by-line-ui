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
  Container,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import {
  UserSettingsDto,
  UpdateUserSettingsRequestDto,
  LearningMode,
} from "@/app/interfaces";
import { fetchApi } from "@/app/lib/api";
import { css } from "@emotion/react";

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

  const showToast = (
    title: string,
    description: string,
    status: "success" | "error"
  ) => {
    toast({ title, description, status, duration: 3000, isClosable: true, position: "top" });
  };

  // Fetch user settings on page load
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const loadSettings = async () => {
      setIsLoading(true);
      try {
        console.log("Try to load settings");
        const response = await fetchApi<UserSettingsDto>("/settings", {
          method: "GET",
        });
        console.log(response);
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
        showToast(
          "Error",
          "Failed to load settings. Please try again.",
          "error"
        );
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
      showToast(
        "Error",
        "Failed to update settings. Please try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Authentication and loading states
  if (authLoading || isLoading) {
    return (
      <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" thickness="3px" speed="0.65s" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    showToast("Error", "Please log in to access this page.", "error");
    router.push("/login");
    return null;
  }

  return (
    <Container maxW="xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size={{ base: "lg", md: "xl" }} textAlign="center">
          Settings
        </Heading>

        <Card>
          <CardBody p={6}>
            <VStack spacing={5} align="stretch">
            {/* Daily New Card Limit */}
            <FormControl>
              <FormLabel>Daily New Card Limit</FormLabel>
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
                <NumberInputField />
              </NumberInput>
              <ChakraText fontSize="sm" color="gray.600" mt={1}>
                Number of new cards you can learn each day (Current:{" "}
                {settings?.newCardsCompletedToday} learned today)
              </ChakraText>
            </FormControl>

            {/* Daily Review Limit */}
            <FormControl>
              <FormLabel>Daily Review Limit</FormLabel>
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
                <NumberInputField />
              </NumberInput>
              <ChakraText fontSize="sm" color="gray.600" mt={1}>
                Number of review cards you can study each day (Current:{" "}
                {settings?.reviewsCompletedToday} reviewed today)
              </ChakraText>
            </FormControl>

            {/* Rollover Hour */}
            <FormControl>
              <FormLabel>Rollover Hour (UTC)</FormLabel>
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
                <NumberInputField />
              </NumberInput>
              <ChakraText fontSize="sm" color="gray.600" mt={1}>
                The hour (in UTC) when daily limits reset (0-23)
              </ChakraText>
            </FormControl>

            {/* Preferred Mode */}
            <FormControl>
              <FormLabel>Preferred Learning Mode</FormLabel>
              <Select
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
              <ChakraText fontSize="sm" color="gray.600" mt={1}>
                Default mode for study sessions
              </ChakraText>
            </FormControl>

            {/* Save Button */}
            <Button colorScheme="brand" isLoading={isSaving} onClick={handleSubmit}>
              Save Settings
            </Button>

            {/* Back to Dashboard Button */}
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
