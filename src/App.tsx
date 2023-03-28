import "@/App.css";
import router from "@/routes";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { RouterProvider } from "react-router-dom";

const mdTheme = createTheme();

function App() {
  return (
    <ThemeProvider theme={mdTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
