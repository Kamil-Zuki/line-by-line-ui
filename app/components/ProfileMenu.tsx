"use client";

import { Menu, MenuButton, MenuList, MenuItem, Portal, Button, Avatar, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";
import { FaChevronDown } from "react-icons/fa";

type Action = {
  label: string;
  color: string;
  onClick: () => void;
};

type ProfileMenuProps = {
  userName: string;
  actions: Action[];
};

const ProfileMenu: FC<ProfileMenuProps> = ({ userName, actions }) => {
  const menuBg = useColorModeValue("white", "gray.800");
  const menuBorderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        rightIcon={<FaChevronDown />}
        w="full"
        justifyContent="space-between"
      >
        <HStack spacing={2}>
          <Avatar size="sm" name={userName} />
          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
            {userName}
          </Text>
        </HStack>
      </MenuButton>
      <Portal>
        <MenuList bg={menuBg} borderColor={menuBorderColor}>
          {actions.map((action, index) => (
            <MenuItem
              color={action.color}
              key={index}
              onClick={action.onClick}
            >
              {action.label}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default ProfileMenu;
