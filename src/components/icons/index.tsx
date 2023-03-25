import { Icon, IconProps } from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  FiHome,
  FiList,
  FiMenu,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

export const createIcon = (iconType: IconType) => {
  //   const color = useColorModeValue("white", "gray.400");
  return (props: IconProps) => {
    return (
      <Icon
        {...props}
        fontSize="16"
        _groupHover={{
          color: "white",
        }}
        //   color={color}
        as={iconType}
      />
    );
  };
};

export const HomeIcon = createIcon(FiHome);
export const DocumentIcon = createIcon(FiList);
export const MenuIcon = createIcon(FiMenu);
export const AddIcon = createIcon(FiPlus);
export const ChevronLeftIcon = createIcon(FiChevronLeft);
export const ChevronRightIcon = createIcon(FiChevronRight);
export const SearchIcon = createIcon(FiSearch);
export const ChevronDownIcon = createIcon(FiChevronDown);
