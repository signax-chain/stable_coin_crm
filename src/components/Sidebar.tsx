import React, { useState } from "react";
import { Coins, Landmark, LineChart, List, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

import { ISidebarItem } from "../models/ISidebarItem";

import styles from "../styles/sidebar.module.css";

export default function SidebarComponent(props: {
  index: number | 0;
  onChange: (i: number) => void;
}) {
  const [sidebarData, _] = useState<ISidebarItem[]>([
    {
      title: "My Dashboard",
      path: "",
      icon: (index: number) => (
        <LineChart
          className={
            props.index !== index
              ? styles["navigation-icon"]
              : styles["navigation-icon-selected"]
          }
        />
      ),
    },
    {
      title: "Tokens Available",
      path: "tokens",
      icon: (index: number) => (
        <Coins
          className={
            props.index !== index
              ? styles["navigation-icon"]
              : styles["navigation-icon-selected"]
          }
        />
      ),
    },
    {
      title: "Commerical Banks",
      path: "banks",
      icon: (index: number) => (
        <Landmark
          className={
            props.index !== index
              ? styles["navigation-icon"]
              : styles["navigation-icon-selected"]
          }
        />
      ),
    },
    {
      title: "View Transactions",
      path: "view",
      icon: (index: number) => (
        <List
          className={
            props.index !== index
              ? styles["navigation-icon"]
              : styles["navigation-icon-selected"]
          }
        />
      ),
    },
    {
      title: "My Accounts",
      path: "account",
      icon: (index: number) => (
        <User
          className={
            props.index !== index
              ? styles["navigation-icon"]
              : styles["navigation-icon-selected"]
          }
        />
      ),
    },
    {
      title: "Logout",
      path: "",
      icon: (index: number) => <LogOut className={styles["navigation-icon"]} />,
    },
  ]);

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
              {sidebar.icon && sidebar.icon(index)}
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
            {sidebarData[sidebarData.length - 1].icon(0)}
            <Link to="" className={styles["a"]}>
              {sidebarData[sidebarData.length - 1].title}
            </Link>
          </div>
        }
      </div>
    </div>
  );
}
