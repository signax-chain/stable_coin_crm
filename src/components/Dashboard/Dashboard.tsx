import React, { useContext, useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";

import AccountContextProvider from "../../context/AccountContextProvider";
import { walletController } from "../../controllers/wallet.controller";
import { IInformationStats, IWalletData } from "../../models/IGeneralFormData";
import { localStorageController } from "../../controllers/storage.controller";
import ContractContextProvider from "../../context/ContractContextProvider";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import { tokenController } from "../../controllers/token.controller";
import { ITokenDetails } from "../../models/ITokenDetail";
import AddToken from "../Modals/AddToken";
import GradientInformationCard from "../Cards/GradientCard";

import styles from "../../styles/dashboard.module.css";
import { useTranslation } from "../../context/TranslatorContextProvider";

export default function DashboardComponent() {
  const [stats, _] = useState<IInformationStats[]>([
    {
      title: "Available Tokens",
      content: "1",
      footer: [
        {
          title: "Country",
          content: "India",
          footer: [],
        },
        {
          title: "Status",
          content: "Success",
          footer: [],
        },
        {
          title: "Type",
          content: "Goods",
          footer: [],
        },
      ],
    },
    {
      title: "Total Supply",
      content: "$15,300",
      footer: [
        {
          title: "Country",
          content: "Italy",
          footer: [],
        },
        {
          title: "Status",
          content: "Success",
          footer: [],
        },
        {
          title: "Type",
          content: "Services",
          footer: [],
        },
      ],
    },
    {
      title: "Available Banks",
      content: "10",
      footer: [
        {
          title: "Country",
          content: "Canada",
          footer: [],
        },
        {
          title: "Status",
          content: "Scheduled",
          footer: [],
        },
        {
          title: "Type",
          content: "Goods",
          footer: [],
        },
      ],
    },
    {
      title: "Total Users",
      content: "100",
      footer: [
        {
          title: "Country",
          content: "Canada",
          footer: [],
        },
        {
          title: "Status",
          content: "Scheduled",
          footer: [],
        },
        {
          title: "Type",
          content: "Goods",
          footer: [],
        },
      ],
    },
    {
      title: "Transactions per month",
      content: "1000",
      footer: [
        {
          title: "Country",
          content: "Canada",
          footer: [],
        },
        {
          title: "Status",
          content: "Scheduled",
          footer: [],
        },
        {
          title: "Type",
          content: "Goods",
          footer: [],
        },
      ],
    },
    {
      title: "Available Banks",
      content: "10",
      footer: [
        {
          title: "Country",
          content: "Canada",
          footer: [],
        },
        {
          title: "Status",
          content: "Scheduled",
          footer: [],
        },
        {
          title: "Type",
          content: "Goods",
          footer: [],
        },
      ],
    },
  ]);
  const { translate, language } = useTranslation();
  const { isLoggedIn, changeContent, changeLogInStatus } = useContext(
    AccountContextProvider
  );
  const [contractAddress, setContractAddress] = useState("");
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  const [openCreateToken, setOpenCreateToken] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const dynamicText = "Central Bank Dashboard";

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const result = await translate(dynamicText, language);
        setTranslatedText(result);
      } catch (error) {
        console.error('Error fetching translation:', error);
      }
    };

    fetchTranslation();
  }, [language]);


  useEffect(() => {
    getContractAddress();
    window.addEventListener("contract_address", getContractAddress);
  }, []);

  const getContractAddress = () => {
    const localStorageData = localStorageController.getData("contract_address");
    if (localStorageData) {
      const data: string = localStorageData;
      setContractAddress(data);
    }
  };

  const connectWallet = async () => {
    const res = await walletController.connectWallet();
    if (res.isConnected) {
      changeLogInStatus(res.isConnected);
      let data = {
        address: res.address?.toString()!,
        balance: Number(res.balance),
      };
      changeContent(data);
      let content: IWalletData = {
        isLoggedIn: res.isConnected,
        data: data,
      };
      localStorageController.setData("wallet", JSON.stringify(content));
    }
  };

  const createToken = async (data: ITokenDetails) => {
    try {
      changeLoaderText("Initializing Token");
      changeLoadingStatus(true);
      const contract_address = await walletController.deployContract();
      if (contract_address) {
        setTimeout(async () => {
          localStorageController.setData("contract_address", contract_address);
          setContractAddress(contract_address);
          const res = await tokenController.createToken(data, contract_address);
          if (res) {
            setOpenCreateToken(false);
            setTimeout(() => {
              changeLoadingStatus(false);
              alert("Token Created Successfully");
            }, 3000);
          } else {
            setTimeout(() => {
              changeLoadingStatus(false);
              alert("Token Creation Failed");
            }, 3000);
          }
        }, 3000);
      }
    } catch (error) {
      changeLoadingStatus(false);
      alert("Token creation failed " + error);
    }
  };

  if (!isLoggedIn || contractAddress.length === 0) {
    return (
      <div className="no__data_container">
        {!isLoggedIn ? (
          <>
            <h3>
              Click on the <strong>connect wallet button</strong> to log in to
              your wallet
            </h3>
            <button onClick={() => connectWallet()}>Connect Wallet</button>
          </>
        ) : (
          <>
            <h3>
              Click on the <strong>initialize wallet button</strong> add your
              token
            </h3>
            <button
              onClick={() => {
                setOpenCreateToken(true);
              }}
            >
              Initialize Platform
            </button>
          </>
        )}
        {
          <AddToken
            isOpen={openCreateToken}
            handleClose={() => setOpenCreateToken(false)}
            handleSubmit={(e: ITokenDetails) => createToken(e)}
          />
        }
      </div>
    );
  }

  return (
    <ContractContextProvider.Provider
      value={{
        contract_address: contractAddress,
        changeContractAddress: setContractAddress,
      }}
    >
      <div className={styles["dashboard-container"]}>
        <h1 className={styles["dashboard-title"]}>{translatedText}</h1>
        <div className={styles["dashboard__stats"]}>
          <div className={styles["dashboard__basic_stats"]}>
            {stats.map((stat, index) => {
              return (
                <div className={styles["dashboard__card"]}>
                  <GradientInformationCard data={stat} />
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles["dashboard-chart"]}>
          <h3>Transactions Per Week</h3>
          <LineChart
            className={styles["line-chart"]}
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 3, 4, 6.5, 3, 5],
                area: true,
              },
            ]}
            width={1000}
            height={300}
          />
        </div>
      </div>
    </ContractContextProvider.Provider>
  );
}
