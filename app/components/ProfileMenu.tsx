import { Menu, MenuButton, MenuList, MenuItem, Portal } from "@chakra-ui/react";
import { FC } from "react";

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
      <MenuButton>{userName}</MenuButton>
      <Portal>
        <MenuList>
          {actions.map((action, index) => (
            <MenuItem
              textColor={action.color}
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
