import { Menu, MenuButton, MenuList, MenuItem, Portal, Button, Avatar, HStack, Text } from "@chakra-ui/react";
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
        <MenuList>
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
