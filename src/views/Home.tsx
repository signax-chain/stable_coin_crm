import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import SidebarComponent from "../components/Sidebar";
import NavbarComponent from "../components/Navbar";
import DashboardComponent from "../components/Dashboard/Dashboard";
import ViewAllTokens from "../components/Tokens/ViewAllTokens";
import ViewAllBankComponents from "../components/Banks/ViewAllBanks";
import ViewBankComponent from "../components/Banks/ViewBankComponent";
import LoaderContextProvider from "../context/LoaderContextProvider";
import Loader from "../components/Modals/Loader";
import { walletController } from "../controllers/wallet.controller";
import AccountContextProvider from "../context/AccountContextProvider";
import { localStorageController } from "../controllers/storage.controller";
import { IWalletData } from "../models/IGeneralFormData";

import styles from "../styles/home.module.css";

export default function HomeLayout() {
  const [selectedSidebarIndex, setSelectedSidebarIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loggedInData, setLoggedInData] = useState({ address: "", balance: 0 });
  const onSidebarChange = (index: number) => {
    setSelectedSidebarIndex(index);
  };

  useEffect(() => {
    getDataFromLocalStorage();
    window.addEventListener("wallet", () => getDataFromLocalStorage);
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
    <LoaderContextProvider.Provider
      value={{
        isLoading: isLoading,
        loaderText: loaderText,
        changeLoaderText: setLoaderText,
        changeLoadingStatus: setIsLoading,
      }}
    >
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
              <NavbarComponent onConnect={() => connectWallet()} />
              <div className={styles["module-content"]}>
                {/* Main module content */}
                <Routes>
                  <Route path="" element={<DashboardComponent />} />
                  <Route path="tokens" element={<ViewAllTokens />} />
                  <Route path="banks" element={<ViewAllBankComponents />} />
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
          <Loader isOpen={isLoading} loaderText={loaderText} />
        </div>
      </AccountContextProvider.Provider>
    </LoaderContextProvider.Provider>
  );
}
