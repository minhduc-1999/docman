import { SlotComponentProps } from "@mui/base";
import { TextField } from "@mui/material";
import {
  DatePicker as MuiDatePicker,
  DatePickerProps,
} from "@mui/x-date-pickers";

export default function DatePicker<TDate>(
  props: DatePickerProps<TDate> & React.RefAttributes<HTMLDivElement>
) {
  const textFieldProps: SlotComponentProps<
    typeof TextField,
    {},
    Record<string, any>
  > = {
    ...props.slotProps?.textField,
    size: "small",
    fullWidth: true,
  };
  return (
    <MuiDatePicker
      format="DD-MM-YYYY"
      {...props}
      slotProps={{
        textField: textFieldProps,
      }}
    />
  );
}
