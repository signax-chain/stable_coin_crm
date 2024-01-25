import React from "react";

import styles from "../styles/explorer.module.css";
import PortalNavbar from "./Navbar/PortalNavbar";
import { Route, Routes } from "react-router-dom";
import IndexLayout from "./Content/Index";

export default function Explorer() {
  return (
    <div className={styles["explorer__container"]}>
      <div className={styles["navbar__container"]}>
        <PortalNavbar />
      </div>
      <div className={styles["explorer__body"]}>
        <Routes>
          <Route path="" element={<IndexLayout />} />
        </Routes>
      </div>
    </div>
  );
}
