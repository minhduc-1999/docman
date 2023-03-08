import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Information } from "@/models/information";

type Props = {
  informationList: Information[];
};

const CriminalInformationTable = ({ informationList }: Props) => {
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
          {informationList.map(
            ({
              id,
              acceptanceNo,
              acceptedAt,
              plaintiff,
              defendant,
              description,
              law,
            }) => {
              return (
                <Tr>
                  <Td>{id}</Td>
                  <Td>{acceptanceNo}</Td>
                  <Td>{acceptedAt.toDateString()}</Td>
                  <Td>{plaintiff}</Td>
                  <Td>{defendant}</Td>
                  <Td>{description}</Td>
                  <Td>{law}</Td>
                </Tr>
              );
            }
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CriminalInformationTable;
