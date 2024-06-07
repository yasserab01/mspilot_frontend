import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  MdDashboard,
  MdPeople,
  MdBusiness,
  MdCategory,
  MdFolder,
  MdAssessment,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import UsersView from "views/admin/users";
import CompaniesView from "views/admin/companies";
import SectionsView from "views/admin/sections";
import RepositoriesView from "views/admin/repositories";
import ReportsView from "views/admin/reports";

// Auth Imports
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: "Home",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdDashboard} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "/users",
    icon: (
      <Icon as={MdPeople} width='20px' height='20px' color='inherit' />
    ),
    component: UsersView,
    secondary: true,
  },
  {
    name: "Companies",
    layout: "/admin",
    path: "/companies",
    icon: <Icon as={MdBusiness} width='20px' height='20px' color='inherit' />,
    component: CompaniesView,
  },
  {
    name: "Sections",
    layout: "/admin",
    path: "/sections",
    icon: <Icon as={MdCategory} width='20px' height='20px' color='inherit' />,
    component: SectionsView,
  },
  {
    name: "Repositories",
    layout: "/admin",
    path: "/repositories",
    icon: <Icon as={MdFolder} width='20px' height='20px' color='inherit' />,
    component: RepositoriesView,
  },
  {
    name: "Reports",
    layout: "/admin",
    path: "/reports",
    icon: <Icon as={MdAssessment} width='20px' height='20px' color='inherit' />,
    component: ReportsView,
  },
  {
    layout: "/auth",
    path: "/sign-in",
    component: SignInCentered,
  },
];

export default routes;
