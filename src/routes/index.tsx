import { createBrowserRouter } from "react-router-dom";
import { HomeIcon, DocumentIcon } from "../components/icons";
import AdminLayout from "../layouts/admin";

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
    icon: HomeIcon,
    element: <AdminLayout children={<div>Dashboard</div>} />,
  },
  {
    name: "Document",
    path: "/document",
    icon: DocumentIcon,
    element: <AdminLayout children={<div>Documents</div>} />,
  },
];

export default createBrowserRouter(
  routes.map((route) => ({
    path: route.path,
    element: route.element,
  }))
);
