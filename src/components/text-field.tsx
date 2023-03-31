import {
  TextFieldProps,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { red } from "@mui/material/colors";

export const TextField: FC<TextFieldProps> = (props) => {
  return (
    <MuiTextField size="small" fullWidth {...props}>
      {props.children}
    </MuiTextField>
  );
};

type FieldLabelProp = {
  content: string;
  required?: boolean;
  disabled?: boolean;
};

export const FieldLabel = ({
  content,
  required = false,
  disabled = false,
}: FieldLabelProp) => {
  return (
    <Typography
      sx={{
        color: (theme) =>
          disabled ? theme.palette.action.disabled : theme.palette.common.black,
      }}
      fontSize={"sm"}
    >
      {required && (
        <Typography
          pr={0.5}
          component={"span"}
          sx={{
            color: () => (disabled ? red[200] : "red"),
          }}
        >
          *
        </Typography>
      )}
      {content}
    </Typography>
  );
};
