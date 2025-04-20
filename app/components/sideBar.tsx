// components/SideBar.tsx
"use client";

import { Box, VStack, Text, Button, Divider, Icon } from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  FaSignInAlt,
} from "react-icons/fa";
import ProfileMenu from "./ProfileMenu"; // Assuming ProfileMenu is in the same directory or correctly imported
import { IconType } from "react-icons";

// Define the interface for a single button's data
interface SideBarButtonData {
  icon: IconType; 
  path: string; 
  labelText: string;
}

interface SideBarProps {
  buttonData: SideBarButtonData[];
  // Add any other props SideBar might need here
}

export default function SideBar({ buttonData }: SideBarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const actions = [
    { label: "Open Profile", onClick: () => handleNavigation("/profile"), color: "black" },
    { label: "Logout", onClick: () => logout(), color: "red" },
  ];

  // Example of how you might conditionally show actions or login button
  const profileActions = isAuthenticated ? actions : [];

  return (
    <Box
      as="nav"
      w={{ base: "full", md: "257px" }}
      h={{ base: "auto", md: "100vh" }}
      bg="#171717"
      color="white"
      p={4}
      position={{ base: "static", md: "fixed" }}
      top={0}
      left={0}
      borderRight="1px solid"
      borderColor="gray.700"
      boxShadow={{ base: "none", md: "lg" }}
      zIndex={10}
    >
      <VStack align="stretch" spacing={4}>
        {/* Logo/Title */}
        <Text
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
          color="teal.300"
          letterSpacing="wider"
          mb={4}
        >
          LBL
        </Text>

        {/* Profile Menu or Login Button */}
        {isAuthenticated && user ? (
           <ProfileMenu userName={user.userName} actions={profileActions}/>
        ) : (
          <Button
            leftIcon={<Icon as={FaSignInAlt} />}
            variant="ghost"
            justifyContent="start"
            w="full"
            color="gray.200"
            _hover={{ bg: "gray.700", color: "teal.300" }}
            onClick={() => handleNavigation("/login")} // Assuming a login path
          >
            Sign In
          </Button>
        )}


        <Divider borderColor="gray.600" />

        {/* Dynamically rendered buttons from props */}
        {buttonData.map((buttonInfo, index) => (
          <Button
            key={index} // Using index as a key is acceptable for static lists, but a unique ID is better if the list can change
            leftIcon={<Icon as={buttonInfo.icon} />}
            variant="ghost"
            justifyContent="start"
            w="full"
            color="gray.200"
            _hover={{ bg: "gray.700", color: "teal.300" }}
            onClick={() => handleNavigation(buttonInfo.path)}
          >
            {buttonInfo.labelText}
          </Button>
        ))}

      </VStack>
    </Box>
  );
}