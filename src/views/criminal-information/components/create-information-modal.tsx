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
  Stack,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateInformationModal({ isOpen, onClose }: Props) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

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
                      <Input ref={initialRef} />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Ngày thụ lý</FormLabel>
                      <SingleDatepicker
                        name="date-input"
                        onDateChange={(date) => {
                          console.log("date change", date);
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Nguyên đơn</FormLabel>
                      <Input />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Bị đơn</FormLabel>
                      <Input />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Điều luật</FormLabel>
                      <Input />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Nội dung</FormLabel>
                      <Textarea />
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
                      <Input ref={initialRef} />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Số phân công</FormLabel>
                      <Input />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Ngày phân công</FormLabel>
                      <SingleDatepicker
                        name="date-input"
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
                          <Radio value="0">Không</Radio>
                          <Radio value="1">Tạm đình chỉ</Radio>
                          <Radio value="2">Khởi tố</Radio>
                          <Radio value="3">Không khởi tố</Radio>
                        </Flex>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Số</FormLabel>
                      <Input />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Ngày</FormLabel>
                      <SingleDatepicker
                        name="date-input"
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
                      <Input />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Số QĐPC</FormLabel>
                      <Input />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Ngày</FormLabel>
                      <SingleDatepicker
                        name="date-input"
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
                      <Textarea />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Kết luận QĐKoKT</FormLabel>
                      <Textarea />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={"sm"}>Kết luận TĐC</FormLabel>
                      <Textarea />
                    </FormControl>
                  </GridItem>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Lưu
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
