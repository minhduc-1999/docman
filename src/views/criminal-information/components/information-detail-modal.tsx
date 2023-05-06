import { useState } from "react";

import {
  Information,
  InformationStatus,
  InvestigationBodyInformation,
  ProcuracyInformation,
} from "@/models/information";
import {
  addNewCriminalInformation,
  updateInformation,
} from "@/services/criminal-information";
import { useAppToast } from "@/hook/toast";
import Grid from "@mui/material/Grid";
import {
  Button,
  Divider,
  FormControl,
  Radio,
  RadioGroup,
  Stack,
  Switch,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FieldLabel, TextField } from "@components/text-field";
import DatePicker from "@components/date-picker";
import moment, { Moment } from "moment";

type Props = {
  information?: Information;
  refresh: () => void;
  onClose: () => void;
};

export function ViewInformationModal({ information, refresh, onClose }: Props) {
  const [haveInvestigation, setHaveInvestigation] = useState(
    information ? !!information.investigationInformation : true
  );
  const [haveProsecution, setHaveProsecution] = useState(
    information ? !!information.procuracyInformation : true
  );

  const [acceptanceNo, setAcceptanceNo] = useState(
    information?.acceptanceNo ?? ""
  );
  const [acceptedAt, setAcceptedAt] = useState<Date | null>(
    information?.acceptedAt ?? null
  );
  const [plaintiff, setPlaintiff] = useState(information?.plaintiff ?? "");
  const [defendant, setDefendant] = useState(information?.defendant ?? "");
  const [law, setLaw] = useState(information?.law ?? "");
  const [description, setDescription] = useState(
    information?.description ?? ""
  );
  const [investigator, setInvestigator] = useState(
    information?.investigationInformation?.investigator ?? ""
  );
  const [invDesignationNo, setInvDesignationNo] = useState(
    information?.investigationInformation?.designationNo ?? ""
  );
  const [invDesignatedAt, setInvDesignatedAt] = useState<Date | null>(
    information?.investigationInformation?.designatedAt ?? null
  );
  const [invStatus, setInvStatus] = useState<InformationStatus>(
    information?.investigationInformation?.status ?? InformationStatus.None
  );
  const [invHandlingNo, setInvHandlingNo] = useState(
    information?.investigationInformation?.handlingNo ?? ""
  );
  const [invHandledAt, setInvHandledAt] = useState<Date | null>(
    information?.investigationInformation?.handledAt ?? null
  );
  const [invTransferredAt, setInvTransferredAt] = useState<Date | null>(
    information?.investigationInformation?.transferredAt ?? null
  );
  const [invExtendedAt, setInvExtendedAt] = useState<Date | null>(
    information?.investigationInformation?.extendedAt ?? null
  );
  const [invRecoveredAt, setInvRecoveredAt] = useState<Date | null>(
    information?.investigationInformation?.recoveredAt ?? null
  );
  const [invCanceledAt, setInvCanceledAt] = useState<Date | null>(
    information?.investigationInformation?.canceledAt ?? null
  );
  const [procurator, setProcurator] = useState(
    information?.procuracyInformation?.procurator ?? ""
  );
  const [proDesignationNo, setProDesignationNo] = useState(
    information?.procuracyInformation?.designationNo ?? ""
  );
  const [proDesignatedAt, setProDesignatedAt] = useState<Date | null>(
    information?.procuracyInformation?.designatedAt ?? null
  );
  const [
    proAdditionalEvidenceRequirement,
    setProAdditionalEvidenceRequirement,
  ] = useState(
    information?.procuracyInformation?.additionalEvidenceRequirement ?? ""
  );
  const [proNonProsecutionDecision, setProNonProsecutionDecision] = useState(
    information?.procuracyInformation?.nonProsecutionDecision ?? ""
  );
  const [proCessationDecision, setProCessationDecision] = useState(
    information?.procuracyInformation?.cessationDecision ?? ""
  );
  const [isError, setIsError] = useState(false);
  const { showSuccessToast, showFailToast } = useAppToast();

  const clear = () => {
    setHaveInvestigation(false);
    setHaveProsecution(false);
    setAcceptedAt(null);
    setAcceptanceNo("");
    setPlaintiff("");
    setDefendant("");
    setLaw("");
    setDescription("");
    setInvestigator("");
    setInvDesignationNo("");
    setInvStatus(InformationStatus.None);
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

  const actionLabel = information ? "Cập nhật" : "Tạo";

  return (
    <Box padding={4} maxWidth={"md"} overflow="visible">
      <Typography fontWeight={"bold"} variant="h4">
        {information ? "Cập nhật tin báo" : "Tin báo mới"}
      </Typography>
      <Divider />
      <Box pb={6}>
        <Grid container columns={1}>
          <Grid xs={4} item>
            <Box>
              <Typography
                marginBottom={1}
                marginTop={1}
                fontWeight={"bold"}
                variant="h6"
              >
                Thông tin chung
              </Typography>
              <Grid container spacing={4} columns={2} columnSpacing={5}>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel required content="Số thụ lý" />
                    <TextField
                      required
                      error={isError && acceptanceNo === ""}
                      value={acceptanceNo}
                      onChange={(event) => setAcceptanceNo(event.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel required content="Ngày thụ lý" />
                    <DatePicker
                      disableFuture
                      value={acceptedAt && moment(acceptedAt)}
                      onChange={(value: Moment | null | undefined) => {
                        if (value) setAcceptedAt(value.toDate());
                      }}
                      slotProps={{
                        textField: {
                          error: isError && acceptedAt === null,
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel required content="Nguyên đơn" />
                    <TextField
                      required
                      error={isError && plaintiff === ""}
                      value={plaintiff}
                      onChange={(event) => {
                        setPlaintiff(event.target.value);
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel required content="Bị đơn" />
                    <TextField
                      required
                      error={isError && defendant === ""}
                      value={defendant}
                      onChange={(event) => setDefendant(event.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box>
                    <FieldLabel content="Điều luật" />
                    <TextField
                      value={law ?? ""}
                      onChange={(event) => setLaw(event.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box>
                    <FieldLabel content="Nội dung" />
                    <TextField
                      multiline
                      value={description ?? ""}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid xs={4} item>
            <Box>
              <Stack
                marginBottom={1}
                marginTop={3}
                direction="row"
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  Cơ quan điều tra
                </Typography>
                <Switch
                  checked={haveInvestigation}
                  onChange={() => setHaveInvestigation(!haveInvestigation)}
                />
              </Stack>

              <Grid container spacing={4} columns={2} columnSpacing={5}>
                <Grid item xs={2}>
                  <Box>
                    <FieldLabel
                      disabled={!haveInvestigation}
                      content="Điều tra viên"
                      required
                    />
                    <TextField
                      disabled={!haveInvestigation}
                      required={haveInvestigation}
                      error={
                        isError && haveInvestigation && investigator === ""
                      }
                      value={investigator}
                      onChange={(event) => setInvestigator(event.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel
                      disabled={!haveInvestigation}
                      content="Số phân công"
                      required
                    />
                    <TextField
                      disabled={!haveInvestigation}
                      required={haveInvestigation}
                      error={
                        isError && haveInvestigation && invDesignationNo === ""
                      }
                      value={invDesignationNo}
                      onChange={(event) =>
                        setInvDesignationNo(event.target.value)
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel
                      disabled={!haveInvestigation}
                      content="Ngày phân công"
                      required
                    />
                    <DatePicker
                      value={invDesignatedAt && moment(invDesignatedAt)}
                      onChange={(value: Moment | null | undefined) => {
                        if (value) setInvDesignatedAt(value.toDate());
                      }}
                      disabled={!haveInvestigation}
                      slotProps={{
                        textField: {
                          error:
                            isError &&
                            invDesignatedAt === null &&
                            haveInvestigation,
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth disabled={!haveInvestigation}>
                    <FieldLabel
                      disabled={!haveInvestigation}
                      content="Trạng thái"
                    />
                    <RadioGroup
                      onChange={(event) => {
                        const value = (event.target as HTMLInputElement).value;
                        setInvStatus(parseInt(value) as InformationStatus);
                      }}
                      value={invStatus?.toString()}
                    >
                      <Stack direction="row" justifyContent={"space-between"}>
                        <FormControlLabel
                          value={InformationStatus.None.toString()}
                          control={<Radio />}
                          label="Không"
                        />
                        <FormControlLabel
                          value={InformationStatus.Cessation.toString()}
                          control={<Radio />}
                          label="Tạm đình chỉ"
                        />
                        <FormControlLabel
                          value={InformationStatus.Prosecution.toString()}
                          control={<Radio />}
                          label="Khởi tố"
                        />
                        <FormControlLabel
                          value={InformationStatus.NonProsecution.toString()}
                          control={<Radio />}
                          label="Không khởi tố"
                        />
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel disabled={!haveInvestigation} content="Số" />
                    <TextField
                      value={invHandlingNo ?? ""}
                      disabled={!haveInvestigation}
                      onChange={(event) => setInvHandlingNo(event.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel disabled={!haveInvestigation} content="Ngày" />
                    <DatePicker
                      value={invHandledAt && moment(invHandledAt)}
                      onChange={(value: Moment | null | undefined) => {
                        if (value) setInvHandledAt(value.toDate());
                      }}
                      disabled={!haveInvestigation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel
                      disabled={!haveInvestigation}
                      content="Chuyển"
                    />
                    <DatePicker
                      value={invTransferredAt && moment(invTransferredAt)}
                      onChange={(value: Moment | null | undefined) => {
                        if (value) setInvTransferredAt(value.toDate());
                      }}
                      disabled={!haveInvestigation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel
                      disabled={!haveInvestigation}
                      content="Gia hạn"
                    />
                    <DatePicker
                      value={invExtendedAt && moment(invExtendedAt)}
                      onChange={(value: Moment | null | undefined) => {
                        if (value) setInvExtendedAt(value.toDate());
                      }}
                      disabled={!haveInvestigation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel
                      disabled={!haveInvestigation}
                      content="Phục hồi"
                    />
                    <DatePicker
                      value={invRecoveredAt && moment(invRecoveredAt)}
                      onChange={(value: Moment | null | undefined) => {
                        if (value) setInvRecoveredAt(value.toDate());
                      }}
                      disabled={!haveInvestigation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel
                      disabled={!haveInvestigation}
                      content="Hủy phân công"
                    />
                    <DatePicker
                      value={invCanceledAt && moment(invCanceledAt)}
                      onChange={(value: Moment | null | undefined) => {
                        if (value) setInvCanceledAt(value.toDate());
                      }}
                      disabled={!haveInvestigation}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid xs={4} item>
            <Box>
              <Stack
                marginBottom={1}
                marginTop={3}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  Viện kiểm sát
                </Typography>
                <Switch
                  checked={haveProsecution}
                  onChange={() => setHaveProsecution(!haveProsecution)}
                />
              </Stack>

              <Grid container spacing={4} columns={2} columnSpacing={5}>
                <Grid item xs={2}>
                  <Box>
                    <FieldLabel
                      disabled={!haveProsecution}
                      content="KSV thụ lý"
                      required
                    />
                    <TextField
                      disabled={!haveProsecution}
                      required={haveProsecution}
                      error={isError && haveProsecution && procurator === ""}
                      value={procurator}
                      onChange={(event) => setProcurator(event.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel
                      required
                      disabled={!haveProsecution}
                      content="Số QĐPC"
                    />
                    <TextField
                      disabled={!haveProsecution}
                      required={haveProsecution}
                      error={
                        isError && haveProsecution && proDesignationNo === ""
                      }
                      value={proDesignationNo}
                      onChange={(event) =>
                        setProDesignationNo(event.target.value)
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Box>
                    <FieldLabel
                      required
                      disabled={!haveProsecution}
                      content="Ngày"
                    />
                    <DatePicker
                      value={proDesignatedAt && moment(proDesignatedAt)}
                      onChange={(value: Moment | null | undefined) => {
                        if (value) setProDesignatedAt(value.toDate());
                      }}
                      disabled={!haveProsecution}
                      slotProps={{
                        textField: {
                          error:
                            isError &&
                            proDesignatedAt === null &&
                            haveProsecution,
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box>
                    <FieldLabel
                      disabled={!haveProsecution}
                      content="Trao đổi/yêu cầu BSCC"
                    />
                    <TextField
                      multiline
                      disabled={!haveProsecution}
                      value={proAdditionalEvidenceRequirement ?? ""}
                      onChange={(event) =>
                        setProAdditionalEvidenceRequirement(event.target.value)
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box>
                    <FieldLabel
                      disabled={!haveProsecution}
                      content="Kết luận QĐKoKT"
                    />
                    <TextField
                      multiline
                      disabled={!haveProsecution}
                      value={proNonProsecutionDecision ?? ""}
                      onChange={(event) =>
                        setProNonProsecutionDecision(event.target.value)
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box>
                    <FieldLabel
                      disabled={!haveProsecution}
                      content="Kết luận TĐC"
                    />
                    <TextField
                      multiline
                      disabled={!haveProsecution}
                      value={proCessationDecision ?? ""}
                      onChange={(event) =>
                        setProCessationDecision(event.target.value)
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Stack direction={"row"} gap={3}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            if (
              !acceptanceNo ||
              !acceptedAt ||
              !plaintiff ||
              !defendant ||
              (haveInvestigation &&
                (!investigator || !invDesignationNo || !invDesignatedAt)) ||
              (haveProsecution &&
                (!procurator || !proDesignationNo || !proDesignatedAt))
            ) {
              setIsError(true);
              return;
            }

            let investigationInfor: InvestigationBodyInformation | null = null;
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
            let promise: Promise<any>;
            if (!information) {
              //create new information
              const newInfor = new Information(
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
              promise = addNewCriminalInformation(newInfor);
            } else {
              const updatingInfor = new Information(
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
              promise = updateInformation(updatingInfor);
            }
            promise
              .then(() => {
                clear();
                showSuccessToast({ title: `${actionLabel} thành công` });
                refresh();
                onClose();
              })
              .catch((err) => {
                console.error(err);
                showFailToast({ title: `${actionLabel} thất bại` });
              });
          }}
        >
          {actionLabel}
        </Button>
        <Button color="error" variant="outlined" fullWidth onClick={onClose}>
          Hủy
        </Button>
      </Stack>
    </Box>
  );
}
