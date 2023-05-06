import DatePicker from "@components/date-picker";
import { FieldLabel } from "@components/text-field";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { Moment } from "moment";
import moment from "moment";
import { exportExcel } from "@/services/criminal-information";
import { save } from "@tauri-apps/api/dialog";
import { homeDir, join } from "@tauri-apps/api/path";
import { useAppToast } from "@/hook/toast";
import { open } from "@tauri-apps/api/shell";

const ReportView = () => {
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [isError, setIsError] = useState(false);
  const { showSuccessToast, showFailToast } = useAppToast();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Grid container rowSpacing={2} columns={2} columnSpacing={5}>
            <Grid item xs={1}>
              <Box>
                <FieldLabel content="Từ ngày" />
                <DatePicker
                  value={from && moment(from)}
                  onChange={(value: Moment | null | undefined) => {
                    if (value) setFrom(value.toDate());
                  }}
                  maxDate={to ? moment(to) : undefined}
                  slotProps={{
                    textField: {
                      error: isError && from === null,
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={1}>
              <Box>
                <FieldLabel content="Đến ngày" />
                <DatePicker
                  minDate={from ? moment(from).add(1, "day") : undefined}
                  value={to && moment(to)}
                  onChange={(value: Moment | null | undefined) => {
                    if (value) setTo(value.toDate());
                  }}
                  slotProps={{
                    textField: {
                      error: isError && to === null,
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={5} mt={2}>
              <Button
                color="info"
                variant="contained"
                fullWidth
                onClick={() => {
                  if (!from || !to) {
                    setIsError(true);
                    return;
                  }
                  const fileName = `${Date.now()}-tin-bao-${moment(from).format(
                    "DDMMYY"
                  )}-${moment(to).format("DDMMYY")}.xlsx`;
                  homeDir()
                    .then((baseDirPath) => join(baseDirPath, fileName))
                    .then((fullPath) => save({ defaultPath: fullPath }))
                    .then((path) => {
                      if (path)
                        return exportExcel({
                          from,
                          to,
                          path,
                        });
                    })
                    .then((savedPath) => {
                      if (savedPath) {
                        showSuccessToast({
                          title: "Tạo báo cáo thành công",
                          action: (
                            <Button
                              color="secondary"
                              size="small"
                              onClick={() => {
                                open(savedPath);
                              }}
                            >
                              Mở
                            </Button>
                          ),
                        });
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                      showFailToast({ title: "Tạo báo cáo thất bại" });
                    });
                }}
              >
                Tạo báo cáo
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ReportView;
