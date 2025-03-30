"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import {
  Flex,
  Box,
  Avatar,
  Text,
  VStack,
  HStack,
  Divider,
  Spinner,
  Badge,
  Card,
  CardBody,
  Icon,
  Input,
  Button,
  useBreakpointValue,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import {
  FiUser,
  FiMail,
  FiShield,
  FiAward,
  FiSettings,
  FiBell,
  FiKey,
  FiLogOut,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiChevronLeft,
} from "react-icons/fi";

const SettingsPage = () => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <Flex minH="100vh" bg="#313338" justify="center" align="center">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="#313338" color="white">
      {/* Sidebar Navigation */}
      {!isMobile && (
        <Box
          w="240px"
          borderRight="1px solid"
          borderColor="whiteAlpha.100"
          bg="#2b2d31"
          p={4}
        >
          <Text fontSize="xl" fontWeight="bold" mb={6} px={2} color="white">
            User Settings
          </Text>
          
          <VStack align="stretch" spacing={1}>
            <Button
              variant={activeTab === "profile" ? "solid" : "ghost"}
              justifyContent="flex-start"
              leftIcon={<FiUser color="white" />}
              onClick={() => setActiveTab("profile")}
              bg={activeTab === "profile" ? "#404249" : "transparent"}
              _hover={{ bg: "#404249" }}
              color="white"
            >
              My Account
            </Button>
            
            <Button
              variant={activeTab === "privacy" ? "solid" : "ghost"}
              justifyContent="flex-start"
              leftIcon={<FiShield color="white" />}
              onClick={() => setActiveTab("privacy")}
              bg={activeTab === "privacy" ? "#404249" : "transparent"}
              _hover={{ bg: "#404249" }}
              color="white"
            >
              Privacy & Safety
            </Button>
            
            <Button
              variant={activeTab === "notifications" ? "solid" : "ghost"}
              justifyContent="flex-start"
              leftIcon={<FiBell color="white" />}
              onClick={() => setActiveTab("notifications")}
              bg={activeTab === "notifications" ? "#404249" : "transparent"}
              _hover={{ bg: "#404249" }}
              color="white"
            >
              Notifications
            </Button>
            
            <Divider borderColor="whiteAlpha.100" my={2} />
            
            <Button
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={<FiLogOut color="red.300" />}
              color="red.300"
              onClick={handleLogout}
              _hover={{ bg: "red.900" }}
            >
              Log Out
            </Button>
          </VStack>
        </Box>
      )}

      {/* Main Content */}
      <Box flex={1} px={{ base: 4, md: 8, lg: 12 }} py={6}>
        {isMobile && (
          <HStack mb={6} spacing={4}>
            <IconButton
              icon={<FiChevronLeft color="white" />}
              aria-label="Back"
              variant="ghost"
              onClick={() => router.back()}
              color="white"
            />
            <Text fontSize="xl" fontWeight="bold" color="white">
              User Settings
            </Text>
          </HStack>
        )}

        <Box maxW="800px" mx="auto">
          {activeTab === "profile" && (
            <>
              <Text fontSize="20px" fontWeight="bold" mb={6} color="white">
                My Account
              </Text>

              {/* Profile Card */}
              <Card bg="#383a40" mb={6} color="white">
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4}>
                      <Box position="relative">
                        <Avatar
                          size="xl"
                          name={user.userName}
                          src={user.avatarUrl}
                          bg="#5865f2"
                          border="4px solid"
                          borderColor="#313338"
                        />
                        <IconButton
                          aria-label="Edit avatar"
                          icon={<FiEdit2 size="14px" color="white" />}
                          size="sm"
                          position="absolute"
                          bottom={0}
                          right={0}
                          bg="#5865f2"
                          borderRadius="full"
                          _hover={{ bg: "#4752c4" }}
                          color="white"
                        />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold" color="white">
                          {user.userName}
                        </Text>
                        <Badge
                          colorScheme={user.emailConfirmed ? "green" : "orange"}
                          px={2}
                          borderRadius="md"
                          fontSize="xs"
                        >
                          {user.emailConfirmed ? "Verified" : "Unverified"}
                        </Badge>
                      </VStack>
                    </HStack>

                    <Divider borderColor="whiteAlpha.100" />

                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" mb={2} color="whiteAlpha.800">
                          USERNAME
                        </Text>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FiUser color="gray" />
                          </InputLeftElement>
                          <Input
                            value={user.userName}
                            bg="#313338"
                            border="none"
                            readOnly
                            color="white"
                            _placeholder={{ color: "whiteAlpha.600" }}
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label="Edit username"
                              icon={<FiEdit2 size="14px" color="white" />}
                              size="sm"
                              variant="ghost"
                              color="white"
                            />
                          </InputRightElement>
                        </InputGroup>
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="bold" mb={2} color="whiteAlpha.800">
                          EMAIL
                        </Text>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FiMail color="gray" />
                          </InputLeftElement>
                          <Input
                            value={user.email}
                            bg="#313338"
                            border="none"
                            readOnly
                            color="white"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label="Edit email"
                              icon={<FiEdit2 size="14px" color="white" />}
                              size="sm"
                              variant="ghost"
                              color="white"
                            />
                          </InputRightElement>
                        </InputGroup>
                      </Box>

                      <Box>
                        <Text fontSize="sm" fontWeight="bold" mb={2} color="whiteAlpha.800">
                          PASSWORD
                        </Text>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FiKey color="gray" />
                          </InputLeftElement>
                          <Input
                            type={showPassword ? "text" : "password"}
                            value="••••••••"
                            bg="#313338"
                            border="none"
                            readOnly
                            color="white"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              icon={showPassword ? 
                                <FiEyeOff size="14px" color="white" /> : 
                                <FiEye size="14px" color="white" />}
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowPassword(!showPassword)}
                              color="white"
                            />
                          </InputRightElement>
                        </InputGroup>
                      </Box>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Danger Zone */}
              <Box>
                <Text fontSize="20px" fontWeight="bold" mb={4} color="red.300">
                  Danger Zone
                </Text>
                <Card bg="#383a40" color="white">
                  <CardBody>
                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="bold" color="white">Delete Account</Text>
                        <Text fontSize="sm" color="whiteAlpha.700">
                          Permanently delete your account and all data
                        </Text>
                      </Box>
                      <Button colorScheme="red" size="sm">
                        Delete
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              </Box>
            </>
          )}

          {activeTab === "privacy" && (
            <Box>
              <Text fontSize="20px" fontWeight="bold" mb={6} color="white">
                Privacy & Safety
              </Text>
              <Card bg="#383a40" color="white">
                <CardBody>
                  <Text color="whiteAlpha.800">Privacy settings would go here...</Text>
                </CardBody>
              </Card>
            </Box>
          )}

          {activeTab === "notifications" && (
            <Box>
              <Text fontSize="20px" fontWeight="bold" mb={6} color="white">
                Notifications
              </Text>
              <Card bg="#383a40" color="white">
                <CardBody>
                  <Text color="whiteAlpha.800">Notification settings would go here...</Text>
                </CardBody>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default SettingsPage;