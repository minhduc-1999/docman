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
import { updateInformation } from "@/services/criminal-information";
import { useAppToast } from "@/hook/toast";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  information: Information;
  refresh: () => void;
};

export function ViewInformationModal({
  isOpen,
  onClose,
  information,
  refresh,
}: Props) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [haveInvestigation, setHaveInvestigation] = useState(
    !!information.investigationInformation
  );
  const [haveProsecution, setHaveProsecution] = useState(
    !!information.procuracyInformation
  );

  const [acceptanceNo, setAcceptanceNo] = useState(information.acceptanceNo);
  const [acceptedAt, setAcceptedAt] = useState<Date>(information.acceptedAt);
  const [plaintiff, setPlaintiff] = useState(information.plaintiff);
  const [defendant, setDefendant] = useState(information.defendant);
  const [law, setLaw] = useState(information.law);
  const [description, setDescription] = useState(information.description);
  const [investigator, setInvestigator] = useState(
    information.investigationInformation?.investigator ?? ""
  );
  const [invDesignationNo, setInvDesignationNo] = useState(
    information.investigationInformation?.designationNo ?? ""
  );
  const [invDesignatedAt, setInvDesignatedAt] = useState<Date | null>(
    information.investigationInformation?.designatedAt ?? null
  );
  const [invStatus, setInvStatus] = useState<InformationStatus | null>(
    information.investigationInformation?.status ?? null
  );
  const [invHandlingNo, setInvHandlingNo] = useState(
    information.investigationInformation?.handlingNo ?? ""
  );
  const [invHandledAt, setInvHandledAt] = useState<Date | null>(
    information.investigationInformation?.handledAt ?? null
  );
  const [invTransferredAt, setInvTransferredAt] = useState<Date | null>(
    information.investigationInformation?.transferredAt ?? null
  );
  const [invExtendedAt, setInvExtendedAt] = useState<Date | null>(
    information.investigationInformation?.extendedAt ?? null
  );
  const [invRecoveredAt, setInvRecoveredAt] = useState<Date | null>(
    information.investigationInformation?.recoveredAt ?? null
  );
  const [invCanceledAt, setInvCanceledAt] = useState<Date | null>(
    information.investigationInformation?.canceledAt ?? null
  );
  const [procurator, setProcurator] = useState(
    information.procuracyInformation?.procurator ?? ""
  );
  const [proDesignationNo, setProDesignationNo] = useState(
    information.procuracyInformation?.designationNo ?? ""
  );
  const [proDesignatedAt, setProDesignatedAt] = useState<Date | null>(
    information.procuracyInformation?.designatedAt ?? null
  );
  const [
    proAdditionalEvidenceRequirement,
    setProAdditionalEvidenceRequirement,
  ] = useState(
    information.procuracyInformation?.additionalEvidenceRequirement ?? ""
  );
  const [proNonProsecutionDecision, setProNonProsecutionDecision] = useState(
    information.procuracyInformation?.nonProsecutionDecision ?? ""
  );
  const [proCessationDecision, setProCessationDecision] = useState(
    information.procuracyInformation?.cessationDecision ?? ""
  );
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
                        value={law ?? ""}
                        onChange={(event) => setLaw(event.target.value)}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Nội dung</FormLabel>
                      <Textarea
                        value={description ?? ""}
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
                      isInvalid={haveInvestigation && !invDesignatedAt}
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
                        value={invHandlingNo ?? ""}
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
                      isInvalid={haveProsecution && !proDesignatedAt}
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
                        value={proAdditionalEvidenceRequirement ?? ""}
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
                        value={proNonProsecutionDecision ?? ""}
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
                        value={proCessationDecision ?? ""}
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
              (haveInvestigation &&
                (!investigator || !invDesignationNo || !invDesignatedAt)) ||
              (haveProsecution &&
                (!procurator || !proDesignationNo || !proDesignatedAt))
            }
            onClick={() => {
              let investigationInfor: InvestigationBodyInformation | null =
                null;
              let prosecutionInfor: ProcuracyInformation | null = null;
              if (haveInvestigation && invDesignatedAt) {
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
              if (haveProsecution && proDesignatedAt) {
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
                information.id,
                acceptanceNo,
                plaintiff,
                defendant,
                acceptedAt,
                law,
                description,
                investigationInfor,
                prosecutionInfor
              );
              updateInformation(infor)
                .then(() => {
                  clear();
                  showSuccessToast("Cập nhật thành công");
                  refresh();
                  onClose();
                })
                .catch((err) => {
                  console.log(err);
                  showFailToast("Cập nhật thất bại");
                });
            }}
          >
            Cập nhật
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
