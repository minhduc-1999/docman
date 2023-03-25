import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@icons";
import CriminalInformationTable from "@/views/criminal-information/components/criminal-information";
import { chakra, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Information } from "@/models/information";
import { CreateInformationModal } from "./components/create-information-modal";
import { getInformationList, Order } from "@/services/criminal-information";
import ReactPaginate from "react-paginate";
import "@/views/criminal-information/paginator.css";

const Paginator = chakra(ReactPaginate);

const CriminalInformationView = () => {
  const [informationList, setInformationList] = useState<Information[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [itemOffset, setItemOffset] = useState(0);
  const [totalItem, setTotalItem] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    getListInformation();
  });

  const pageCount = Math.ceil(totalItem / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % totalItem;
    setItemOffset(newOffset);
  };

  const getListInformation = () => {
    getInformationList({
      offset: itemOffset,
      limit: itemsPerPage,
      order: Order.ASC,
    }).then((data) => {
      setInformationList(data[0]);
      setTotalItem(data[1]);
    });
  };

  const onAddNewInformation = () => {
    onOpen();
  };

  return (
    <>
      <HStack width="100%" height={10} backgroundColor="gray.100">
        <IconButton
          onClick={onAddNewInformation}
          aria-label="Add information"
          w={10}
          h={5}
          icon={<AddIcon />}
        />
      </HStack>
      <CriminalInformationTable informationList={informationList} />
      <Paginator
        breakLabel="..."
        nextLabel={<ChevronRightIcon />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel={<ChevronLeftIcon />}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
        className="paginator"

        // renderOnZeroPageCount={null}
      />
      <CreateInformationModal
        isOpen={isOpen}
        onClose={onClose}
        refeshInformationList={getListInformation}
      />
    </>
  );
};

export default CriminalInformationView;
