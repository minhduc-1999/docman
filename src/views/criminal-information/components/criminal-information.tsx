import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

const CriminalInformationTable = () => {
  return (
    <TableContainer>
      <Table size={"sm"} variant="simple">
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>ReplyNo</Th>
            <Th>ReplyAt</Th>
            <Th>Plaintiff</Th>
            <Th>Defendant</Th>
            <Th>Description</Th>
            <Th>Law</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Data</Td>
            <Td>Data</Td>
            <Td>Data</Td>
            <Td>Data</Td>
            <Td>Data</Td>
            <Td>Data</Td>
            <Td>Data</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CriminalInformationTable;
