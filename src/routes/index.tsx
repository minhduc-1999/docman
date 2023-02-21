import { createBrowserRouter } from "react-router-dom";
import { HomeIcon, DocumentIcon } from "@icons";
import AdminLayout from "@layouts/admin";
import CriminalInformationView from "@/views/criminal-information";

export type Route = {
  name: string;
  path: string;
  icon: JSX.Element;
  element: JSX.Element;
  children?: Omit<Route, "children">[];
};

export const routes: Array<Route> = [
  {
    name: "Home",
    path: "/",
    icon: <HomeIcon mr={4} />,
    element: <AdminLayout children={<div>Dashboard</div>} />,
  },
  {
    name: "Criminal Information",
    path: "/criminal-information",
    icon: <DocumentIcon mr={4} />,
    element: <AdminLayout children={<CriminalInformationView />} />,
  },
];

export default createBrowserRouter(
  routes.map((route) => ({
    path: route.path,
    element: route.element,
  }))
);
