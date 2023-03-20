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
  Textarea,
} from "@chakra-ui/react";
import React, { useReducer } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Information, InformationStatus } from "@/models/information";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  information?: Information;
};

type CreateAction = {
  type: "create";
  newValue: Partial<Information>;
};

type UpdateAction = {
  type: "update";
  updatedKey: keyof Information;
  updatedValue: string;
};

type DeleteAction = {
  type: "delete";
};

function reducer(
  state: Partial<Information>,
  action: CreateAction | UpdateAction | DeleteAction
): Partial<Information> {
  switch (action.type) {
    case "create": {
      return action.newValue;
    }
    case "update": {
      return {
        ...state,
        [action.updatedKey]: action.updatedValue,
      };
    }
    case "delete": {
      return {};
    }
    default: {
      throw new Error("Invalid action");
    }
  }
}

export function InformationDetail({ isOpen, onClose, information }: Props) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [informationState, dispatch] = useReducer(reducer, information ?? {});

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
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Số thụ lý</FormLabel>
                      <Input
                        ref={initialRef}
                        value={informationState.acceptanceNo}
                        onChange={(event) =>
                          dispatch({
                            type: "update",
                            updatedKey: "acceptanceNo",
                            updatedValue: event.target.value,
                          })
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Ngày thụ lý</FormLabel>
                      <SingleDatepicker
                        name="date-input"
                        date={informationState.acceptedAt}
                        onDateChange={(date) => {
                          dispatch({
                            type: "update",
                            updatedKey: "acceptedAt",
                            updatedValue: date.toString(),
                          });
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Nguyên đơn</FormLabel>
                      <Input value={informationState.plaintiff} />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Bị đơn</FormLabel>
                      <Input value={informationState.defendant} />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Điều luật</FormLabel>
                      <Input value={informationState.law} />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Nội dung</FormLabel>
                      <Textarea value={informationState.description} />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>
            </Box>

            <Box>
              <h2>
                <Box>
                  <Box as="span" fontWeight={"600"} flex="1" textAlign="left">
                    Cơ quan điều tra
                  </Box>
                </Box>
              </h2>

              <Box pb={4} mt={2}>
                <Grid templateColumns="repeat(2, 1fr)" columnGap={4} rowGap={2}>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Điều tra viên</FormLabel>
                      <Input
                        value={
                          informationState.investigationInformation
                            ?.investigator
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Số phân công</FormLabel>
                      <Input
                        value={
                          informationState.investigationInformation
                            ?.designationNo
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Ngày phân công</FormLabel>
                      <SingleDatepicker
                        name="date-input"
                        date={
                          informationState.investigationInformation
                            ?.designatedAt
                        }
                        onDateChange={(date) => {
                          console.log("date change", date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Trạng thái</FormLabel>
                      <RadioGroup
                      //   onChange={setValue}
                      //   value={value}
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
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Số</FormLabel>
                      <Input
                        value={
                          informationState.investigationInformation?.handlingNo
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Ngày</FormLabel>
                      <SingleDatepicker
                        name="date-input"
                        date={
                          informationState.investigationInformation?.handledAt
                        }
                        onDateChange={(date) => {
                          console.log("date change", date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Chuyển</FormLabel>
                      <SingleDatepicker
                        name="date-input"
                        date={
                          informationState.investigationInformation
                            ?.transferredAt
                        }
                        onDateChange={(date) => {
                          console.log("date change", date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Gia hạn</FormLabel>
                      <SingleDatepicker
                        name="date-input"
                        date={
                          informationState.investigationInformation?.extendedAt
                        }
                        onDateChange={(date) => {
                          console.log("date change", date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Phục hồi</FormLabel>
                      <SingleDatepicker
                        name="date-input"
                        date={
                          informationState.investigationInformation?.recoveredAt
                        }
                        onDateChange={(date) => {
                          console.log("date change", date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Hủy phân công</FormLabel>
                      <SingleDatepicker
                        name="date-input"
                        date={
                          informationState.investigationInformation?.canceledAt
                        }
                        onDateChange={(date) => {
                          console.log("date change", date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>
            </Box>

            <Box>
              <h2>
                <Box>
                  <Box as="span" flex="1" fontWeight={"600"} textAlign="left">
                    Viện kiểm sát
                  </Box>
                </Box>
              </h2>
              <Box pb={4} mt={2}>
                <Grid templateColumns="repeat(2, 1fr)" columnGap={4} rowGap={2}>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>KSV thụ lý</FormLabel>
                      <Input
                        value={
                          informationState.procuracyInformation?.procurator
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Số QĐPC</FormLabel>
                      <Input
                        value={
                          informationState.procuracyInformation?.designationNo
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Ngày</FormLabel>
                      <SingleDatepicker
                        name="date-input"
                        date={
                          informationState.procuracyInformation?.designatedAt
                        }
                        onDateChange={(date) => {
                          console.log("date change", date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>
                        Trao đổi/yêu cầu BSCC
                      </FormLabel>
                      <Textarea
                        value={
                          informationState.procuracyInformation
                            ?.additionalEvidenceRequirement
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Kết luận QĐKoKT</FormLabel>
                      <Textarea
                        value={
                          informationState.procuracyInformation
                            ?.nonProsecutionDecision
                        }
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Kết luận TĐC</FormLabel>
                      <Textarea
                        value={
                          informationState.procuracyInformation
                            ?.cessationDecision
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
            onClick={() => {
              dispatch({
                type: "create",
                newValue: informationState,
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
