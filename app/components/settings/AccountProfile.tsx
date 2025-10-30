"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text as ChakraText,
  VStack,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiKey, FiUser, FiEye, FiEyeOff } from "react-icons/fi";

interface AccountProfileProps {
  user: {
    id: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    avatarUrl?: string;
  };
}

const AccountProfile = ({ user }: AccountProfileProps) => {
  const { updatePassword, updateUsername, loading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUsername, setNewUsername] = useState(user.userName);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    username: "",
  });

  const passwordModal = useDisclosure();
  const usernameModal = useDisclosure();
  const toast = useToast();

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const modalBg = useColorModeValue("white", "gray.800");

  const showToast = (title: string, description: string, status: "success" | "error") => {
    toast({
      position: "top",
      duration: status === "success" ? 3000 : 5000,
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

  const validatePasswordForm = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      username: "",
    };

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateUsernameForm = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      username: "",
    };

    if (!newUsername) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (newUsername.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordUpdate = async () => {
    if (!validatePasswordForm()) return;

    const result = await updatePassword(currentPassword, newPassword);

    if (result.success) {
      showToast("Success", result.message || "Password updated successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      passwordModal.onClose();
    } else {
      let errorMessage = result.error || "Failed to update password";
      if (result.error?.includes("405")) {
        errorMessage = "Password update method not allowed. Contact support.";
      }
      showToast("Error", errorMessage, "error");
    }
  };

  const handleUsernameUpdate = async () => {
    if (!validateUsernameForm()) return;

    const result = await updateUsername(newUsername);

    if (result.success) {
      showToast("Success", result.message || "Username updated successfully", "success");
      usernameModal.onClose();
    } else {
      showToast("Error", result.error || "Failed to update username", "error");
    }
  };

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="lg"
      p={6}
      color={textColor}
      boxShadow="sm"
    >
      <ChakraText fontSize="xl" fontWeight="semibold" mb={4}>
        Account
      </ChakraText>

      {/* Username Section */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        pb={4}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Box>
          <ChakraText fontSize="sm" color={labelColor} textTransform="uppercase">
            USERNAME
          </ChakraText>
          <ChakraText>{user.userName}</ChakraText>
        </Box>
        <Button
          size="sm"
          colorScheme="brand"
          onClick={usernameModal.onOpen}
        >
          Edit
        </Button>
      </Flex>

      {/* Email Section */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        pb={4}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Box>
          <ChakraText fontSize="sm" color={labelColor} textTransform="uppercase">
            EMAIL
          </ChakraText>
          <ChakraText>{user.email}</ChakraText>
        </Box>
        {/* Add edit button if email editing is desired */}
      </Flex>

      {/* Password Section */}
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <ChakraText fontSize="sm" color={labelColor} textTransform="uppercase">
            PASSWORD
          </ChakraText>
          <ChakraText>••••••••</ChakraText>
        </Box>
        <Button
          size="sm"
          colorScheme="brand"
          onClick={passwordModal.onOpen}
        >
          Change Password
        </Button>
      </Flex>

      {/* Password Modal */}
      <Modal isOpen={passwordModal.isOpen} onClose={passwordModal.onClose}>
        <ModalOverlay />
        <ModalContent
          bg={modalBg}
          color={textColor}
          border="2px solid"
          borderColor={cardBorder}
          borderRadius="md"
        >
          <ModalHeader>Change Your Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.currentPassword}>
                <FormLabel color={labelColor} textTransform="uppercase" fontSize="sm">
                  Current Password
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiKey />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.currentPassword}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.newPassword}>
                <FormLabel color={labelColor} textTransform="uppercase" fontSize="sm">
                  New Password
                </FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <FormErrorMessage>
                  {errors.newPassword}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel color={labelColor} textTransform="uppercase" fontSize="sm">
                  Confirm New Password
                </FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FormErrorMessage>
                  {errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={passwordModal.onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handlePasswordUpdate}
              isLoading={loading}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Username Modal */}
      <Modal isOpen={usernameModal.isOpen} onClose={usernameModal.onClose}>
        <ModalOverlay />
        <ModalContent
          bg={modalBg}
          color={textColor}
        >
          <ModalHeader>Change Your Username</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.username}>
              <FormLabel color={labelColor} textTransform="uppercase" fontSize="sm">
                Username
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiUser />
                </InputLeftElement>
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.username}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={usernameModal.onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleUsernameUpdate}
              isLoading={loading}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AccountProfile;