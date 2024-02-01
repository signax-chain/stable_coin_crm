import React, { useEffect, useState } from "react";
import { Coins, Landmark, LineChart, List, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

import { ISidebarItem } from "../models/ISidebarItem";

import styles from "../styles/sidebar.module.css";
import { useTranslation } from "../context/TranslatorContextProvider";
import { useRoleFinder } from "../context/RoleContextProvider";
import {
  AdminNavbarData,
  BankNavbarData,
  CentralBankNavbarData,
  UserNavbarData,
} from "../helpers/NavbarData";

export default function SidebarComponent(props: {
  index: number | 0;
  onChange: (i: number) => void;
}) {
  const { translate, language } = useTranslation();
  const { role } = useRoleFinder();
  const [sidebarData, setSidebarData] = useState<ISidebarItem[]>([
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
      title: "My Accounts",
      path: "account",
      icon: <User className="navigation-icon" />,
    },
    {
      title: "Logout",
      path: "logout",
      icon: <LogOut className="navigation-icon" />,
    },
  ]);

  useEffect(() => {
    if (role.role === "team") {
      setSidebarData(AdminNavbarData);
    } else if (role.role === "user") {
      setSidebarData(UserNavbarData);
    } else if (role.role === "central_bank") {
      setSidebarData(CentralBankNavbarData);
    } else if (role.role === "bank") {
      setSidebarData(BankNavbarData);
    }
  }, [role]);

  useEffect(() => {
    async function generateData() {
      let data = [
        {
          title: await translate("My Dashboard"),
          path: "",
          icon: <LineChart className="navigation-icon" />,
        },
        {
          title: await translate("Commercial Banks"),
          path: "banks",
          icon: <Landmark className="navigation-icon" />,
        },
        {
          title: await translate("Stable Coins"),
          path: "coins",
          icon: <Coins className="navigation-icon" />,
        },
        {
          title: await translate("View Transactions"),
          path: "/explorer/transactions",
          icon: <List className="navigation-icon" />,
        },
        {
          title: await translate("My Accounts"),
          path: "account",
          icon: <User className="navigation-icon" />,
        },
        {
          title: await translate("Logout"),
          path: "logout",
          icon: <LogOut className="navigation-icon" />,
        },
      ];
      setSidebarData(data);
    }
    // generateData();
  }, [language]);

  return (
    <div className={styles["sidebar-container"]}>
      <div className={styles["logo-container"]}>
        <h1>LOGO HERE</h1>
      </div>
      <div className={styles["navigation-container"]}>
        {sidebarData.slice(0, sidebarData.length - 1).map((sidebar, index) => {
          return (
            <div
              className={
                props.index !== index
                  ? styles["navigation-bar"]
                  : styles["navigation-bar-selected"]
              }
              onClick={() => props.onChange(index)}
              key={index}
            >
              {sidebar.icon && sidebar.icon}
              <Link to={sidebar.path!} className={styles["a"]}>
                {sidebar.title}
              </Link>
            </div>
          );
        })}
      </div>
      <div className={styles["navigation-logout"]}>
        {
          <div className={styles["navigation-bar"]}>
            {sidebarData[sidebarData.length - 1].icon}
            <Link to={sidebarData[sidebarData.length - 1].path} className={styles["a"]}>
              {sidebarData[sidebarData.length - 1].title}
            </Link>
          </div>
        }
      </div>
    </div>
  );
}
