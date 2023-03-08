import { AddIcon } from "@icons";
import CriminalInformationTable from "@/views/criminal-information/components/criminal-information";
import { HStack, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { Information } from "@/models/information";
import { createInformation } from "@/mock/information";

const CriminalInformationView = () => {
  const [informationList, setInformationList] = useState<Information[]>([]);
  const onAddNewInformation = () => {
    createInformation().then((doc) => {
      setInformationList([...informationList, doc]);
    });
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
    </>
  );
};

export default CriminalInformationView;
