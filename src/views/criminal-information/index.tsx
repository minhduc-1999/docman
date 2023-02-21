import { AddIcon } from "@icons";
import CriminalInformationTable from "@/views/criminal-information/components/criminal-information";
import { HStack, IconButton } from "@chakra-ui/react";

const CriminalInformationView = () => {
  return (
    <>
      <HStack width="100%" height={10} backgroundColor="gray.100">
        <IconButton aria-label="Add document" w={10} h={5} icon={<AddIcon />} />
      </HStack>
      <CriminalInformationTable />
    </>
  );
};

export default CriminalInformationView;
