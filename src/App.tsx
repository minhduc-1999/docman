import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routes";

function App() {
  return <ChakraProvider>{<RouterProvider router={router} />}</ChakraProvider>;
}

export default App;
