import { LineChart, Landmark, Coins, List, User, LogOut, Settings } from "lucide-react";
import { ISidebarItem } from "../models/ISidebarItem";

export const AdminNavbarData: ISidebarItem[] = [
  {
    title: "My Dashboard",
    path: "",
    icon: <LineChart className="navigation-icon" />,
  },
  {
    title: "Commerical Banks",
    path: "banks",
    icon: <Landmark className="navigation-icon" />,
  },
  {
    title: "Stable Coins",
    path: "coins",
    icon: <Coins className="navigation-icon" />,
  },
  {
    title: "View Transactions",
    path: "/explorer/transactions",
    icon: <List className="navigation-icon" />,
  },
  {
    title: "Platform Users",
    path: "users",
    icon: <User className="navigation-icon" />,
  },
  {
    title: "Logout",
    path: "logout",
    icon: <LogOut className="navigation-icon" />,
  },
];

export const CentralBankNavbarData: ISidebarItem[] = [
  {
    title: "My Dashboard",
    path: "",
    icon: <LineChart className="navigation-icon" />,
  },
  {
    title: "Commerical Banks",
    path: "banks",
    icon: <Landmark className="navigation-icon" />,
  },
  {
    title: "View Transactions",
    path: "/explorer/transactions",
    icon: <List className="navigation-icon" />,
  },
  {
    title: "My Accounts",
    path: "account",
    icon: <User className="navigation-icon" />,
  },
  {
    title: "Logout",
    path: "logout",
    icon: <LogOut className="navigation-icon" />,
  },
];

export const BankNavbarData: ISidebarItem[] = [
  {
    title: "My Dashboard",
    path: "",
    icon: <LineChart className="navigation-icon" />,
  },
  {
    title: "Commerical Banks",
    path: "banks",
    icon: <Landmark className="navigation-icon" />,
  },
  {
    title: "View Transactions",
    path: "/explorer/transactions",
    icon: <List className="navigation-icon" />,
  },
  {
    title: "My Accounts",
    path: "account",
    icon: <User className="navigation-icon" />,
  },
  {
    title: "Logout",
    path: "logout",
    icon: <LogOut className="navigation-icon" />,
  },
];

export const UserNavbarData: ISidebarItem[] = [
  {
    title: "My Dashboard",
    path: "",
    icon: <LineChart className="navigation-icon" />,
  },
  {
    title: "Commerical Banks",
    path: "banks",
    icon: <Landmark className="navigation-icon" />,
  },
  {
    title: "View Transactions",
    path: "/explorer/transactions",
    icon: <List className="navigation-icon" />,
  },
  {
    title: "My Accounts",
    path: "account",
    icon: <User className="navigation-icon" />,
  },
  {
    title: "Logout",
    path: "logout",
    icon: <LogOut className="navigation-icon" />,
  },
];