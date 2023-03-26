import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
} from "@chakra-ui/react";
import { Information } from "@/models/information";
import moment from "moment";
import { ViewInformationModal } from "./view-information-modal";
import { useState } from "react";

type Props = {
  informationList: Information[];
  refresh: () => void;
};

const CriminalInformationTable = ({ informationList, refresh }: Props) => {
  const [selectedInfor, setSelectedInfor] = useState<Information | null>(null);
  const {
    isOpen: isViewModalOpen,
    onClose: onViewModalClose,
    onOpen: onViewModalOpen,
  } = useDisclosure();
  return (
    <TableContainer>
      <Table size={"sm"} variant="simple">
        <Thead>
          <Tr>
            <Th>Số thứ tự</Th>
            <Th>Số thụ lý</Th>
            <Th>Ngày thụ lý</Th>
            <Th>Nguyên đơn</Th>
            <Th>Bị đơn</Th>
            <Th>Nội dung</Th>
            <Th>Điều luật</Th>
          </Tr>
        </Thead>
        <Tbody>
          {informationList.map((inforItem, index) => {
            const {
              id,
              acceptanceNo,
              acceptedAt,
              plaintiff,
              defendant,
              description,
              law,
            } = inforItem;
            return (
              <Tr
                _hover={{ bgColor: "blue.50" }}
                bgColor={id === selectedInfor?.id ? "blue.100" : "white"}
                key={index}
                onClick={() => {
                  setSelectedInfor(inforItem);
                }}
                onDoubleClick={onViewModalOpen}
              >
                <Td>{index + 1}</Td>
                <Td>{acceptanceNo}</Td>
                <Td>{moment(acceptedAt.toISOString()).format("DD/MM/YYYY")}</Td>
                <Td>{plaintiff}</Td>
                <Td>{defendant}</Td>
                <Td>{description}</Td>
                <Td>{law}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {selectedInfor && isViewModalOpen && (
        <ViewInformationModal
          isOpen={isViewModalOpen}
          onClose={onViewModalClose}
          information={selectedInfor}
          refresh={refresh}
        />
      )}
    </TableContainer>
  );
};

export default CriminalInformationTable;
