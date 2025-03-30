"use client";

import { useState } from "react";
import {
  VStack,
  HStack,
  Avatar,
  Text,
  Divider,
  Card,
  CardBody,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Badge,
  Box,
} from "@chakra-ui/react";
import { FiUser, FiMail, FiKey, FiEdit2, FiEye, FiEyeOff } from "react-icons/fi";

interface AccountProfileProps {
  user: {
    userName: string;
    email: string;
    emailConfirmed: boolean;
    avatarUrl?: string;
    id: string;
  };
}

const AccountProfile = ({ user }: AccountProfileProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Text fontSize="20px" fontWeight="bold" mb={6} color="white">
        My Account
      </Text>

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
              <EditableField
                label="USERNAME"
                icon={<FiUser />}
                value={user.userName}
              />
              <EditableField
                label="EMAIL"
                icon={<FiMail />}
                value={user.email}
              />
              <PasswordField
                showPassword={showPassword}
                onToggleVisibility={() => setShowPassword(!showPassword)}
              />
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </>
  );
};

const EditableField = ({ label, icon, value }: { label: string; icon: React.ReactElement; value: string }) => (
  <Box>
    <Text fontSize="sm" fontWeight="bold" mb={2} color="whiteAlpha.800">
      {label}
    </Text>
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        {icon}
      </InputLeftElement>
      <Input
        value={value}
        bg="#313338"
        border="none"
        readOnly
        color="white"
      />
      <InputRightElement>
        <IconButton
          aria-label={`Edit ${label}`}
          icon={<FiEdit2 size="14px" color="white" />}
          size="sm"
          variant="ghost"
          color="white"
        />
      </InputRightElement>
    </InputGroup>
  </Box>
);

const PasswordField = ({ showPassword, onToggleVisibility }: { 
  showPassword: boolean; 
  onToggleVisibility: () => void 
}) => (
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
          onClick={onToggleVisibility}
          color="white"
        />
      </InputRightElement>
    </InputGroup>
  </Box>
);

export default AccountProfile;