import { createBrowserRouter, useNavigate } from "react-router-dom";
import CriminalInformationView from "@/views/criminal-information";
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import BallotIcon from "@mui/icons-material/Ballot";
import DashboardView from "@/views/dashboard";
import Layout from "@layouts/admin";
import ReportView from "@/views/report";

export type Route = {
  name: string;
  path: string;
  icon: JSX.Element;
  element: JSX.Element;
  children?: Omit<Route, "children">[];
};

export const routes: Array<Route> = [
  {
    name: "Dashboard",
    path: "/",
    icon: <DashboardIcon />,
    element: <Layout children={<DashboardView />} />,
  },
  {
    name: "Tin báo",
    path: "/information",
    icon: <BallotIcon />,
    element: <Layout children={<CriminalInformationView />} />,
  },
  {
    name: "Báo cáo",
    path: "/report",
    icon: <BarChartIcon />,
    element: <Layout children={<ReportView />} />,
  },
];

export default createBrowserRouter(
  routes.map((route) => ({
    path: route.path,
    element: route.element,
  }))
);

export const RouteItems = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      {routes.map((route) => (
        <ListItemButton
          onClick={() => navigate(route.path, { replace: true })}
          key={route.path}
        >
          <ListItemIcon>{route.icon}</ListItemIcon>
          <ListItemText primary={route.name} />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};
