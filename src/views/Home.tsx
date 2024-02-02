import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import SidebarComponent from "../components/Sidebar";
import NavbarComponent from "../components/Navbar";
import DashboardComponent from "../components/Dashboard/Dashboard";
import ViewAllTokens from "../components/Tokens/ViewAllTokens";
import ViewAllBankComponents from "../components/Banks/ViewAllBanks";
import ViewBankComponent from "../components/Banks/ViewBankComponent";
import { walletController } from "../controllers/wallet.controller";
import AccountContextProvider from "../context/AccountContextProvider";
import { localStorageController } from "../controllers/storage.controller";
import { IWalletData } from "../models/IGeneralFormData";

import CoinIndex from "../components/Coins/Index";
import { useRoleFinder } from "../context/RoleContextProvider";

import styles from "../styles/home.module.css";
import LogoutComponent from "../components/Logout";
import PlatformUsers from "../components/Users/PlatformUsers";
import { INotificationUserDetails } from "../models/INotifications";
import { notificationController } from "../controllers/database/notification.controller";
import NotificationComponent from "../components/Notification/NotificationComponent";

export default function HomeLayout() {
  const [selectedSidebarIndex, setSelectedSidebarIndex] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loggedInData, setLoggedInData] = useState({ address: "", balance: 0 });
  const [allNotifications, setAllNotifications] = useState<
    INotificationUserDetails[]
  >([]);
  const { userInformation } = useRoleFinder();
  const onSidebarChange = (index: number) => {
    setSelectedSidebarIndex(index);
  };

  useEffect(() => {
    getDataFromLocalStorage();
    window.addEventListener("wallet", () => getDataFromLocalStorage);
    notificationController
      .getAllNotifications(userInformation?.user_id!)
      .then((value) => {
        setAllNotifications(value);
      });
  }, []);

  const getDataFromLocalStorage = () => {
    const localStorageData = localStorageController.getData("wallet");
    if (localStorageData) {
      const data: IWalletData = JSON.parse(localStorageData);
      setIsConnected(data.isLoggedIn);
      setLoggedInData(data.data);
    }
  };

  const connectWallet = async () => {
    const res = await walletController.connectWallet();
    console.log(res.isConnected);
    if (res.isConnected) {
      setIsConnected(res.isConnected);
      let data = {
        address: res.address?.toString()!,
        balance: Number(res.balance),
      };
      setLoggedInData(data);
      let content: IWalletData = {
        isLoggedIn: res.isConnected,
        data: data,
      };
      localStorageController.setData("wallet", JSON.stringify(content));
    }
  };

  return (
    <AccountContextProvider.Provider
      value={{
        isLoggedIn: isConnected,
        data: loggedInData,
        changeContent: setLoggedInData,
        changeLogInStatus: setIsConnected,
      }}
    >
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
            <NavbarComponent
              onConnect={() => connectWallet()}
              notificationLength={allNotifications.length}
            />
            <div className={styles["module-content"]}>
              {/* Main module content */}
              <Routes>
                <Route path="" element={<DashboardComponent />} />
                <Route path="tokens" element={<ViewAllTokens />} />
                <Route path="coins" element={<CoinIndex />} />
                <Route path="banks" element={<ViewAllBankComponents />} />
                <Route path="logout" element={<LogoutComponent />} />
                <Route path="users" element={<PlatformUsers />} />
                <Route
                  path="notifications"
                  element={
                    <NotificationComponent notifications={allNotifications} />
                  }
                />
                <Route path="banks/:id" element={<ViewBankComponent />} />
                <Route
                  path="view"
                  element={
                    <div className="no__data_container">
                      <h3>
                        Click on the <strong>connect wallet button</strong> to
                        log in to your wallet
                      </h3>
                      <button onClick={() => connectWallet()}>
                        Connect Wallet
                      </button>
                    </div>
                  }
                />
                <Route
                  path="accounts"
                  element={
                    <div className="no__data_container">
                      <h3>
                        Click on the <strong>connect wallet button</strong> to
                        log in to your wallet
                      </h3>
                      <button onClick={() => connectWallet()}>
                        Connect Wallet
                      </button>
                    </div>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </AccountContextProvider.Provider>
  );
}
