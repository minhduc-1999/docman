import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import "@/App.css";
import router from "@/routes";
import { useEffect } from "react";
import { DbContext } from "./infrastructure/dbcontext";
import { once } from "@tauri-apps/api/event";

function App() {
  useEffect(() => {
    once("loaded", ({ event, payload }) => {
      console.log(event);
      console.log(payload);
      console.log("window loaded");
    }).then((unsub) => unsub());
    console.log("here");
  }, []);
  return <ChakraProvider>{<RouterProvider router={router} />}</ChakraProvider>;
}

export default App;
