// app/components/settings/AccountProfile.tsx
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
  Text,
  VStack,
  useDisclosure,
  useToast,
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
      toast({
        title: "Success",
        description: result.message || "Password updated successfully",
        status: "success",
        duration: 3000,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      passwordModal.onClose();
    } else {
      let errorMessage = result.error || "Failed to update password";
      if (result.error?.includes("405")) {
        errorMessage = "Password update method not allowed. Contact support.";
      }
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleUsernameUpdate = async () => {
    if (!validateUsernameForm()) return;

    const result = await updateUsername(newUsername);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "Username updated successfully",
        status: "success",
        duration: 3000,
      });
      usernameModal.onClose();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update username",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box bg="#2f3136" borderRadius="md" p={4} color="white">
      <Text fontSize="xl" fontWeight="semibold" mb={4}>
        Account
      </Text>

      {/* Username Section */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        pb={4}
        borderBottom="1px"
        borderColor="gray.700"
      >
        <Box>
          <Text fontSize="sm" color="gray.400">
            USERNAME
          </Text>
          <Text>{user.userName}</Text>
        </Box>
        <Button
          size="sm"
          bg="#5865f2"
          _hover={{ bg: "#4752c4" }}
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
        borderColor="gray.700"
      >
        <Box>
          <Text fontSize="sm" color="gray.400">
            EMAIL
          </Text>
          <Text>{user.email}</Text>
        </Box>
        {/* Add edit button if email editing is desired */}
      </Flex>

      {/* Password Section */}
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Text fontSize="sm" color="gray.400">
            PASSWORD
          </Text>
          <Text>••••••••</Text>
        </Box>
        <Button
          size="sm"
          bg="#5865f2"
          _hover={{ bg: "#4752c4" }}
          onClick={passwordModal.onOpen}
        >
          Change Password
        </Button>
      </Flex>

      {/* Password Modal */}
      <Modal isOpen={passwordModal.isOpen} onClose={passwordModal.onClose}>
        <ModalOverlay />
        <ModalContent bg="#36393f" color="white">
          <ModalHeader>Change Your Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.currentPassword}>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiKey color="gray" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    bg="#202225"
                    border="none"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.newPassword}>
                <FormLabel>New Password</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  bg="#202225"
                  border="none"
                />
                <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg="#202225"
                  border="none"
                />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={passwordModal.onClose}>
              Cancel
            </Button>
            <Button
              bg="#5865f2"
              _hover={{ bg: "#4752c4" }}
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
        <ModalContent bg="#36393f" color="white">
          <ModalHeader>Change Your Username</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiUser color="gray" />
                </InputLeftElement>
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  bg="#202225"
                  border="none"
                />
              </InputGroup>
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={usernameModal.onClose}>
              Cancel
            </Button>
            <Button
              bg="#5865f2"
              _hover={{ bg: "#4752c4" }}
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
