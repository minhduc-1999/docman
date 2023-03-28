import {
  AddIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@icons";
import CriminalInformationTable from "@/views/criminal-information/components/criminal-information";
import {
  Button,
  chakra,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Information } from "@/models/information";
import { CreateInformationModal } from "./components/create-information-modal";
import {
  getInformationList,
  getNewInformationList,
  Order,
} from "@/services/criminal-information";
import ReactPaginate from "react-paginate";
import "@/views/criminal-information/paginator.css";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Orders from "./components/table";

const Paginator = chakra(ReactPaginate);

type FilterOption = "all" | "new";
type Setting = {
  filter: FilterOption;
};

const CriminalInformationView = () => {
  const [informationList, setInformationList] = useState<Information[]>([]);
  const {
    isOpen: isCreateModalOpen,
    onClose: onCreateModalClose,
    onOpen: onCreateModalOpen,
  } = useDisclosure();

  const [itemOffset, setItemOffset] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [setting, setSetting] = useState<Setting>({
    filter: "all",
  });

  const itemsPerPage = 100;

  useEffect(() => {
    getListInformation();
  }, [itemOffset, searchTerm, setting.filter]);

  const pageCount = Math.ceil(totalItem / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % totalItem;
    setItemOffset(newOffset);
  };

  const getListInformation = () => {
    // let getListService = getInformationList;
    switch (setting.filter) {
      case "all": {
        getInformationList({
          offset: itemOffset,
          limit: itemsPerPage,
          order: Order.ASC,
          search: searchTerm ? searchTerm : null,
        }).then((data) => {
          setInformationList(data[0]);
          setTotalItem(data[1]);
        });
        break;
      }
      case "new": {
        getNewInformationList({
          offset: itemOffset,
          limit: itemsPerPage,
          order: Order.ASC,
          search: searchTerm ? searchTerm : null,
        }).then((data) => {
          setInformationList(data[0]);
          setTotalItem(data[1]);
        });
        break;
      }
    }
  };

  const onAddNewInformation = () => {
    onCreateModalOpen();
  };

  return (
    // <>
    //   <Flex
    //     alignItems={"center"}
    //     py={2}
    //     width="100%"
    //     backgroundColor="gray.100"
    //     justifyContent={"space-between"}
    //     gap={3}
    //   >
    //     <IconButton
    //       onClick={onAddNewInformation}
    //       aria-label="Add information"
    //       icon={<AddIcon />}
    //     />
    //     <InputGroup size={"sm"} height={"100%"}>
    //       <InputLeftElement
    //         pointerEvents="none"
    //         children={<SearchIcon boxSize={4} />}
    //       />
    //       <Input
    //         value={searchTerm}
    //         onChange={(event) => {
    //           setSearchTerm(event.target.value);
    //           setItemOffset(0);
    //           setTotalItem(0);
    //         }}
    //         type="text"
    //         placeholder="Tìm kiếm"
    //       />
    //     </InputGroup>
    //     <Menu closeOnSelect={false}>
    //       <MenuButton
    //         fontSize={"sm"}
    //         as={Button}
    //         rightIcon={<ChevronDownIcon />}
    //       >
    //         Thiết lập
    //       </MenuButton>
    //       <MenuList minWidth="240px">
    //         <MenuOptionGroup
    //           onChange={(option) =>
    //             setSetting({
    //               ...setting,
    //               filter: option as FilterOption,
    //             })
    //           }
    //           defaultValue="all"
    //           title="Lọc"
    //           type="radio"
    //         >
    //           <MenuItemOption value="all">Tất cả</MenuItemOption>
    //           <MenuItemOption value="new">Tin báo mới</MenuItemOption>
    //         </MenuOptionGroup>
    //       </MenuList>
    //     </Menu>
    //   </Flex>
    //   <CriminalInformationTable
    //     refresh={getListInformation}
    //     informationList={informationList}
    //   />
    //   <Paginator
    //     breakLabel="..."
    //     nextLabel={<ChevronRightIcon />}
    //     onPageChange={handlePageClick}
    //     pageRangeDisplayed={2}
    //     pageCount={pageCount}
    //     previousLabel={<ChevronLeftIcon />}
    //     breakClassName="page-item"
    //     breakLinkClassName="page-link"
    //     containerClassName="pagination justify-content-center"
    //     pageClassName="page-item"
    //     pageLinkClassName="page-link"
    //     previousClassName="page-item"
    //     previousLinkClassName="page-link"
    //     nextClassName="page-item"
    //     nextLinkClassName="page-link"
    //     activeClassName="active"
    //     className="paginator"
    //     renderOnZeroPageCount={undefined}
    //   />
    //   <CreateInformationModal
    //     isOpen={isCreateModalOpen}
    //     onClose={onCreateModalClose}
    //     refeshInformationList={getListInformation}
    //   />
    // </>
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        ></Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        ></Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Orders />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CriminalInformationView;
