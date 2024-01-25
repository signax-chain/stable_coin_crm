import React from "react";

import styles from "../styles/portal_navbar.module.css";
import { Bell, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PortalNavbar() {
  const navigate = useNavigate();

  return (
    <div className={styles["portal__navbar_container"]}>
      <div className={styles["logo__component"]}>
        <h1>Logo Here</h1>
      </div>
      <div className={styles["navbar__actions"]}>
        <Bell color="white" style={{ cursor: "pointer" }} />
        <div className={styles["spacer"]}></div>
        <Home
          color="white"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        />
        <div className={styles["spacer"]}></div>
      </div>
    </div>
  );
}
