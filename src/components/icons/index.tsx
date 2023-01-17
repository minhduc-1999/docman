import { Icon, useColorModeValue } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiHome, FiList, FiMenu } from "react-icons/fi";

export const createIcon = (iconType: IconType) => {
  //   const color = useColorModeValue("white", "gray.400");
  return (
    <Icon
      mr="4"
      fontSize="16"
      _groupHover={{
        color: "white",
      }}
      //   color={color}
      as={iconType}
    />
  );
};

export const HomeIcon = createIcon(FiHome);
export const DocumentIcon = createIcon(FiList);
export const MenuIcon = createIcon(FiMenu);
