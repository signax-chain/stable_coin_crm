import React from "react";

import { Bell, Wallet } from "lucide-react";
import { Badge } from "@mui/material";

import styles from "../styles/navbar.module.css";

export default function NavbarComponent() {
  return (
    <div className={styles["navbar-container"]}>
      <Wallet className={styles["notification"]} />
      <Badge badgeContent={0} color="success">
        <Bell className={styles["notification"]} />
      </Badge>
      <div style={{ marginRight: "30px" }}></div>
    </div>
  );
}
