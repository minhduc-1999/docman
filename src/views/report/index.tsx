import DatePicker from "@components/date-picker";
import { FieldLabel, TextField } from "@components/text-field";
import { Box, Button, IconButton, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useState } from "react";
import { Moment } from "moment";
import moment from "moment";
import { exportExcel } from "@/services/criminal-information";
const ReportView = () => {
  const [storagePath, setStoragePath] = useState<string>("");
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);
  const [isError, setIsError] = useState(false);

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
            <Grid item xs={5}>
              <Box>
                <FieldLabel required content="Thư mục" />
                <TextField
                  required
                  error={isError && storagePath === ""}
                  value={storagePath}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          // onClick={handleClickShowPassword}
                          // onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          <FolderOpenIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
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
                  exportExcel();
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
