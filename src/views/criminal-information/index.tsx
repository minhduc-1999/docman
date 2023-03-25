import { AddIcon } from "@icons";
import CriminalInformationTable from "@/views/criminal-information/components/criminal-information";
import { HStack, IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Information } from "@/models/information";
import { CreateInformationModal } from "./components/create-information-modal";
import {
  getInformationList,
  QueryOption,
} from "@/services/criminal-information";

const CriminalInformationView = () => {
  const [informationList, setInformationList] = useState<Information[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    getListInformation();
  }, []);

  const getListInformation = () => {
    getInformationList(new QueryOption()).then((data) => {
      setInformationList(data);
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
      <CreateInformationModal
        isOpen={isOpen}
        onClose={onClose}
        refeshInformationList={getListInformation}
      />
    </>
  );
};

export default CriminalInformationView;
