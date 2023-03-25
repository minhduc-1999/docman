import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { chakra } from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

const AppDatePicker = chakra(DatePicker);

import {
  Information,
  InformationStatus,
  InvestigationBodyInformation,
  ProcuracyInformation,
} from "@/models/information";
import { addNewCriminalInformation } from "@/services/criminal-information";
import { useAppToast } from "@/hook/toast";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  refeshInformationList: () => void;
};

export function CreateInformationModal({
  isOpen,
  onClose,
  refeshInformationList,
}: Props) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [haveInvestigation, setHaveInvestigation] = useState(false);
  const [haveProsecution, setHaveProsecution] = useState(false);

  const [acceptanceNo, setAcceptanceNo] = useState("");
  const [acceptedAt, setAcceptedAt] = useState<Date>(new Date());
  const [plaintiff, setPlaintiff] = useState("");
  const [defendant, setDefendant] = useState("");
  const [law, setLaw] = useState("");
  const [description, setDescription] = useState("");
  const [investigator, setInvestigator] = useState("");
  const [invDesignationNo, setInvDesignationNo] = useState("");
  const [invDesignatedAt, setInvDesignatedAt] = useState<Date>(new Date());
  const [invStatus, setInvStatus] = useState<InformationStatus | null>(null);
  const [invHandlingNo, setInvHandlingNo] = useState("");
  const [invHandledAt, setInvHandledAt] = useState<Date | null>(null);
  const [invTransferredAt, setInvTransferredAt] = useState<Date | null>(null);
  const [invExtendedAt, setInvExtendedAt] = useState<Date | null>(null);
  const [invRecoveredAt, setInvRecoveredAt] = useState<Date | null>(null);
  const [invCanceledAt, setInvCanceledAt] = useState<Date | null>(null);
  const [procurator, setProcurator] = useState("");
  const [proDesignationNo, setProDesignationNo] = useState("");
  const [proDesignatedAt, setProDesignatedAt] = useState<Date>(new Date());
  const [
    proAdditionalEvidenceRequirement,
    setProAdditionalEvidenceRequirement,
  ] = useState("");
  const [proNonProsecutionDecision, setProNonProsecutionDecision] =
    useState("");
  const [proCessationDecision, setProCessationDecision] = useState("");
  const { showSuccessToast, showFailToast } = useAppToast();

  const clear = () => {
    setHaveInvestigation(false);
    setHaveProsecution(false);

    setAcceptanceNo("");
    setPlaintiff("");
    setDefendant("");
    setLaw("");
    setDescription("");
    setInvestigator("");
    setInvDesignationNo("");
    setInvStatus(null);
    setInvHandlingNo("");
    setInvTransferredAt(null);
    setInvExtendedAt(null);
    setInvRecoveredAt(null);
    setInvCanceledAt(null);
    setProcurator("");
    setProDesignationNo("");
    setProAdditionalEvidenceRequirement("");
    setProNonProsecutionDecision("");
    setProCessationDecision("");
    setInvHandledAt(null);
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      size={"6xl"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm tin báo mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns={"repeat(3, 1fr)"} columnGap={10}>
            <Box>
              <h2>
                <Box>
                  <Box as="span" fontWeight={"600"} flex="1" textAlign="left">
                    Thông tin chung
                  </Box>
                </Box>
              </h2>
              <Box pb={4} mt={2}>
                <Grid templateColumns="repeat(2, 1fr)" columnGap={4} rowGap={2}>
                  <GridItem>
                    <FormControl isRequired isInvalid={acceptanceNo === ""}>
                      <FormLabel fontSize={"sm"}>Số thụ lý</FormLabel>
                      <Input
                        ref={initialRef}
                        value={acceptanceNo}
                        onChange={(event) =>
                          setAcceptanceNo(event.target.value)
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize={"sm"}>Ngày thụ lý</FormLabel>
                      <AppDatePicker
                        dateFormat={"dd/MM/yyyy"}
                        locale="vi"
                        border="1px solid"
                        borderRadius={3}
                        borderColor={"gray.200"}
                        name="date-input"
                        selected={acceptedAt}
                        onChange={(date: Date) => {
                          setAcceptedAt(date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isRequired isInvalid={plaintiff === ""}>
                      <FormLabel fontSize={"sm"}>Nguyên đơn</FormLabel>
                      <Input
                        value={plaintiff}
                        onChange={(event) => {
                          setPlaintiff(event.target.value);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isRequired isInvalid={defendant === ""}>
                      <FormLabel fontSize={"sm"}>Bị đơn</FormLabel>
                      <Input
                        value={defendant}
                        onChange={(event) => setDefendant(event.target.value)}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Điều luật</FormLabel>
                      <Input
                        value={law}
                        onChange={(event) => setLaw(event.target.value)}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Nội dung</FormLabel>
                      <Textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>
            </Box>

            <Box>
              <h2>
                <Flex justifyContent={"space-between"}>
                  <Box as="span" fontWeight={"600"} flex="1" textAlign="left">
                    Cơ quan điều tra
                  </Box>
                  <Switch
                    isChecked={haveInvestigation}
                    onChange={() => setHaveInvestigation(!haveInvestigation)}
                  />
                </Flex>
              </h2>

              <Box pb={4} mt={2}>
                <Grid templateColumns="repeat(2, 1fr)" columnGap={4} rowGap={2}>
                  <GridItem colSpan={2}>
                    <FormControl
                      isDisabled={!haveInvestigation}
                      isRequired={haveInvestigation}
                      isInvalid={haveInvestigation && investigator === ""}
                    >
                      <FormLabel fontSize={"sm"}>Điều tra viên</FormLabel>
                      <Input
                        value={investigator}
                        onChange={(event) =>
                          setInvestigator(event.target.value)
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      isDisabled={!haveInvestigation}
                      isRequired={haveInvestigation}
                      isInvalid={haveInvestigation && invDesignationNo === ""}
                    >
                      <FormLabel fontSize={"sm"}>Số phân công</FormLabel>
                      <Input
                        value={invDesignationNo}
                        onChange={(event) =>
                          setInvDesignationNo(event.target.value)
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      isDisabled={!haveInvestigation}
                      isRequired={haveInvestigation}
                    >
                      <FormLabel fontSize={"sm"}>Ngày phân công</FormLabel>
                      <AppDatePicker
                        dateFormat={"dd/MM/yyyy"}
                        locale={"vi"}
                        disabled={!haveInvestigation}
                        name="date-input"
                        selected={invDesignatedAt}
                        onChange={(date: Date) => {
                          setInvDesignatedAt(date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isDisabled={!haveInvestigation}>
                      <FormLabel fontSize={"sm"}>Trạng thái</FormLabel>
                      <RadioGroup
                        onChange={(value) => {
                          setInvStatus(parseInt(value) as InformationStatus);
                        }}
                        value={invStatus?.toString()}
                      >
                        <Flex direction="row" justifyContent={"space-between"}>
                          <Radio value={InformationStatus.None.toString()}>
                            Không
                          </Radio>
                          <Radio value={InformationStatus.Cessation.toString()}>
                            Tạm đình chỉ
                          </Radio>
                          <Radio
                            value={InformationStatus.Prosecution.toString()}
                          >
                            Khởi tố
                          </Radio>
                          <Radio
                            value={InformationStatus.NonProsecution.toString()}
                          >
                            Không khởi tố
                          </Radio>
                        </Flex>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isDisabled={!haveInvestigation}>
                      <FormLabel fontSize={"sm"}>Số</FormLabel>
                      <Input
                        value={invHandlingNo}
                        onChange={(event) =>
                          setInvHandlingNo(event.target.value)
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isDisabled={!haveInvestigation}>
                      <FormLabel fontSize={"sm"}>Ngày</FormLabel>
                      <AppDatePicker
                        dateFormat={"dd/MM/yyyy"}
                        locale={"vi"}
                        disabled={!haveInvestigation}
                        name="date-input"
                        selected={invHandledAt}
                        onChange={(date: Date | null) => {
                          setInvHandledAt(date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isDisabled={!haveInvestigation}>
                      <FormLabel fontSize={"sm"}>Chuyển</FormLabel>
                      <AppDatePicker
                        dateFormat={"dd/MM/yyyy"}
                        locale={"vi"}
                        disabled={!haveInvestigation}
                        name="date-input"
                        selected={invTransferredAt}
                        onChange={(date: Date | null) => {
                          setInvTransferredAt(date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isDisabled={!haveInvestigation}>
                      <FormLabel fontSize={"sm"}>Gia hạn</FormLabel>
                      <AppDatePicker
                        dateFormat={"dd/MM/yyyy"}
                        locale={"vi"}
                        disabled={!haveInvestigation}
                        name="date-input"
                        selected={invExtendedAt}
                        onChange={(date: Date | null) => {
                          setInvExtendedAt(date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isDisabled={!haveInvestigation}>
                      <FormLabel fontSize={"sm"}>Phục hồi</FormLabel>
                      <AppDatePicker
                        dateFormat={"dd/MM/yyyy"}
                        locale={"vi"}
                        disabled={!haveInvestigation}
                        name="date-input"
                        selected={invRecoveredAt}
                        onChange={(date: Date | null) => {
                          setInvRecoveredAt(date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isDisabled={!haveInvestigation}>
                      <FormLabel fontSize={"sm"}>Hủy phân công</FormLabel>
                      <AppDatePicker
                        dateFormat={"dd/MM/yyyy"}
                        locale={"vi"}
                        disabled={!haveInvestigation}
                        name="date-input"
                        selected={invCanceledAt}
                        onChange={(date: Date | null) => {
                          setInvCanceledAt(date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>
            </Box>

            <Box>
              <h2>
                <Flex justifyContent={"space-between"}>
                  <Box as="span" fontWeight={"600"} flex="1" textAlign="left">
                    Viện kiểm sát
                  </Box>
                  <Switch
                    isChecked={haveProsecution}
                    onChange={() => setHaveProsecution(!haveProsecution)}
                  />
                </Flex>
              </h2>
              <Box pb={4} mt={2}>
                <Grid templateColumns="repeat(2, 1fr)" columnGap={4} rowGap={2}>
                  <GridItem colSpan={2}>
                    <FormControl
                      isDisabled={!haveProsecution}
                      isRequired={haveProsecution}
                      isInvalid={haveProsecution && procurator === ""}
                    >
                      <FormLabel fontSize={"sm"}>KSV thụ lý</FormLabel>
                      <Input
                        value={procurator}
                        onChange={(event) => setProcurator(event.target.value)}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      isDisabled={!haveProsecution}
                      isRequired={haveProsecution}
                      isInvalid={haveProsecution && proDesignationNo === ""}
                    >
                      <FormLabel fontSize={"sm"}>Số QĐPC</FormLabel>
                      <Input
                        value={proDesignationNo}
                        onChange={(event) =>
                          setProDesignationNo(event.target.value)
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl
                      isDisabled={!haveProsecution}
                      isRequired={haveProsecution}
                    >
                      <FormLabel fontSize={"sm"}>Ngày</FormLabel>
                      <AppDatePicker
                        locale={"vi"}
                        disabled={!haveProsecution}
                        dateFormat={"dd/MM/yyyy"}
                        name="date-input"
                        selected={proDesignatedAt}
                        onChange={(date: Date) => {
                          setProDesignatedAt(date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isDisabled={!haveProsecution}>
                      <FormLabel fontSize={"sm"}>
                        Trao đổi/yêu cầu BSCC
                      </FormLabel>
                      <Textarea
                        value={proAdditionalEvidenceRequirement}
                        onChange={(event) =>
                          setProAdditionalEvidenceRequirement(
                            event.target.value
                          )
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isDisabled={!haveProsecution}>
                      <FormLabel fontSize={"sm"}>Kết luận QĐKoKT</FormLabel>
                      <Textarea
                        value={proNonProsecutionDecision}
                        onChange={(event) =>
                          setProNonProsecutionDecision(event.target.value)
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isDisabled={!haveProsecution}>
                      <FormLabel fontSize={"sm"}>Kết luận TĐC</FormLabel>
                      <Textarea
                        value={proCessationDecision}
                        onChange={(event) =>
                          setProCessationDecision(event.target.value)
                        }
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            isDisabled={
              !acceptanceNo ||
              !plaintiff ||
              !defendant ||
              (haveInvestigation && (!investigator || !invDesignationNo)) ||
              (haveProsecution && (!procurator || !proDesignationNo))
            }
            onClick={() => {
              let investigationInfor: InvestigationBodyInformation | null =
                null;
              let prosecutionInfor: ProcuracyInformation | null = null;
              if (haveInvestigation) {
                investigationInfor = new InvestigationBodyInformation(
                  investigator,
                  invDesignationNo,
                  invDesignatedAt,
                  invStatus,
                  invHandledAt,
                  invTransferredAt,
                  invHandlingNo,
                  invExtendedAt,
                  invRecoveredAt,
                  invCanceledAt
                );
              }
              if (haveProsecution) {
                prosecutionInfor = new ProcuracyInformation(
                  procurator,
                  proDesignationNo,
                  proDesignatedAt,
                  proAdditionalEvidenceRequirement,
                  proNonProsecutionDecision,
                  proCessationDecision
                );
              }
              const infor = new Information(
                "",
                acceptanceNo,
                plaintiff,
                defendant,
                acceptedAt,
                law,
                description,
                investigationInfor,
                prosecutionInfor
              );
              addNewCriminalInformation(infor)
                .then(() => {
                  refeshInformationList();
                  clear();
                  showSuccessToast("Tạo thành công");
                  onClose();
                })
                .catch((err) => {
                  console.log(err);
                  showFailToast("Tạo thất bại");
                });
            }}
          >
            Lưu
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
