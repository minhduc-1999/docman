import "@/App.css";
import router from "@/routes";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { SnackbarProvider } from "notistack";
import { RouterProvider } from "react-router-dom";

const mdTheme = createTheme();

const MAX_NOTIFICATION_STACK = 3;

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={mdTheme}>
        <SnackbarProvider maxSnack={MAX_NOTIFICATION_STACK}>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
