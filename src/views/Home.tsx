import React, { useState } from "react";

import styles from "../styles/home.module.css";
import SidebarComponent from "../components/Sidebar";
import NavbarComponent from "../components/Navbar";
import { Route, Routes } from "react-router-dom";
import DashboardComponent from "../components/Dashboard/Dashboard";
import ViewAllTokens from "../components/Tokens/ViewAllTokens";
import ViewAllBankComponents from "../components/Banks/ViewAllBanks";
import ViewBank from "../components/Banks/ViewBankComponent";
import ViewBankComponent from "../components/Banks/ViewBankComponent";

export default function HomeLayout() {
  const [selectedSidebarIndex, setSelectedSidebarIndex] = useState<number>(0);

  const onSidebarChange = (index: number) => {
    setSelectedSidebarIndex(index);
  };

  return (
    <div className={styles["home-container"]}>
      <div className={styles["home-content"]}>
        <div className={styles["sidebar-content"]}>
          {/* Sidebar content */}
          <SidebarComponent
            index={selectedSidebarIndex}
            onChange={onSidebarChange}
          />
        </div>
        <div className={styles["main-content"]}>
          {/* Navbar content */}
          <NavbarComponent />
          <div className={styles["module-content"]}>
            {/* Main module content */}
            <Routes>
              <Route path="" element={<DashboardComponent />} />
              <Route path="tokens" element={<ViewAllTokens />} />
              <Route path="banks" element={<ViewAllBankComponents />} />
              <Route path="banks/:id" element={<ViewBankComponent />} />
              <Route path="view" element={<div></div>} />
              <Route path="accounts" element={<div></div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
