import { Box, Flex, Grid } from "@chakra-ui/react";
import SideBar from "../components/sidebar";

type AdminLayoutProps = {
  children: JSX.Element;
};

export default function AdminLayout(props: AdminLayoutProps) {
  return (
    <Flex>
      <SideBar />
      <Box
        ml={{ base: 0, md: 60 }}
        p="4"
        border="1px"
        borderColor="red.200"
        flexGrow={1}
      >
        {props.children}
      </Box>
    </Flex>
  );
}
