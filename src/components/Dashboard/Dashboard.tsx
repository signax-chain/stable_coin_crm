import React, { useContext, useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";

import AccountContextProvider from "../../context/AccountContextProvider";
import { walletController } from "../../controllers/wallet.controller";
import { IInformationStats, ITransferTokenFormData, IWalletData } from "../../models/IGeneralFormData";
import { localStorageController } from "../../controllers/storage.controller";
import ContractContextProvider from "../../context/ContractContextProvider";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import { tokenController } from "../../controllers/token.controller";
import { ITokenDetails } from "../../models/ITokenDetail";
import AddToken from "../Modals/AddToken";
import GradientInformationCard from "../Cards/GradientCard";

import styles from "../../styles/dashboard.module.css";
import { useTranslation } from "../../context/TranslatorContextProvider";
import { CONTRACT_ADDRESS } from "../../helpers/Constants";
import { IBankDetails } from "../../models/IBankDetails";
import { bankController } from "../../controllers/bank.controller";
import TransferToken from "../Modals/TransferToken";
import { toast } from "react-toastify";
import { userController } from "../../controllers/user.controller";
import { useRoleFinder } from "../../context/RoleContextProvider";

export default function DashboardComponent() {
  const [stats, setStats] = useState<IInformationStats[]>([
    {
      title: "Available Tokens",
      content: "1",
      footer: [],
    },
    {
      title: "Total Supply",
      content: "$15,300",
      footer: [],
    },
    {
      title: "Available Banks",
      content: "10",
      footer: [],
    },
    {
      title: "Total Users",
      content: "100",
      footer: [],
    },
    {
      title: "Transactions per month",
      content: "1000",
      footer: [],
    },
    {
      title: "Available Banks",
      content: "10",
      footer: [],
    },
  ]);
  const { translate, language } = useTranslation();
  const { isLoggedIn, changeContent, changeLogInStatus, data } = useContext(
    AccountContextProvider
  );
  const [tokensAvailable, setTokenAvailable] = useState<
    ITokenDetails | undefined
  >(undefined);
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  const [openCreateToken, setOpenCreateToken] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [allBanks, setAllBanks] = useState<IBankDetails[]>([]);
  const [openTransferTokenModal, setOpenTransferTokenModal] = useState(false);
  const {userInformation, setUserInformation} = useRoleFinder();
  const dynamicText = "Central Bank Dashboard";

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const result = await translate(dynamicText, language);
        setTranslatedText(result);
      } catch (error) {
        console.error("Error fetching translation:", error);
      }
    };
    fetchTranslation();
  }, [language]);

  useEffect(() => {
    getContractAddress();
  }, []);

  const getContractAddress = async () => {
    const address = localStorageController.getData("wallet");
    if (address) {
      changeLoaderText("Fetching Tokens....");
      changeLoadingStatus(true);
      const data: IWalletData = JSON.parse(address);
      const tokenData = await tokenController.getAllToken(data!.data.address);
      const balance = await bankController.getBalanceOf(data!.data.address, CONTRACT_ADDRESS);
      const allBanks = await bankController.getAllBanks();
      if (tokenData.length) {
        let token: ITokenDetails = {
          token_id: tokenData[0].token_id,
          token_name: tokenData[0].name,
          token_description: " ",
          token_supply: balance,
        };
        setTokenAvailable(token);
        let statsData = [
          {
            title: "Available Tokens",
            content: `${tokenData.length}`,
            footer: [
              {
                title: "Last Updated",
                content: `${new Date().toDateString()}`,
                footer: [],
              },
            ],
          },
          {
            title: "Total Supply",
            content: `${balance}`,
            footer: [
              {
                title: "Last Updated",
                content: `${new Date().toDateString()}`,
                footer: [],
              },
            ],
          },
          {
            title: "Available Banks",
            content: `${allBanks.length}`,
            footer: [
              {
                title: "Last Updated",
                content: `${new Date().toDateString()}`,
                footer: [],
              },
            ],
          },
          {
            title: "Total Users",
            content: "100",
            footer: [
              {
                title: "Last Updated",
                content: `${new Date().toDateString()}`,
                footer: [],
              },
            ],
          },
          {
            title: "Transactions per month",
            content: "1000",
            footer: [
              {
                title: "Last Updated",
                content: `${new Date().toDateString()}`,
                footer: [],
              },
            ],
          },
          {
            title: "Available Banks",
            content: "10",
            footer: [
              {
                title: "Last Updated",
                content: `${new Date().toDateString()}`,
                footer: [],
              },
            ],
          },
        ];
        setStats(statsData);
        setAllBanks(allBanks);
      } else {
        setTokenAvailable(undefined);
      }
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    }
  };

  const connectWallet = async () => {
    const res = await walletController.connectWallet();
    if (res.isConnected) {
      let userData = {...userInformation};
      userData.address = res.address!;
      await userController.updateUserDetails( userData.user_id! , userData);
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

  const createToken = async (tokenData: ITokenDetails) => {
    try {
      changeLoaderText("Initializing Token");
      changeLoadingStatus(true);
      const res = await tokenController.createToken(
        tokenData,
        CONTRACT_ADDRESS,
        data.address
      );
      if (res) {
        setOpenCreateToken(false);
        setTimeout(() => {
          changeLoadingStatus(false);
          alert("Token Created Successfully");
          window.location.reload();
        }, 3000);
      } else {
        setTimeout(() => {
          changeLoadingStatus(false);
          alert("Token Creation Failed");
        }, 3000);
      }
    } catch (error) {
      changeLoadingStatus(false);
      alert("Token creation failed " + error);
    }
  };

  const onTransferToken = async (e: ITransferTokenFormData) => {
    try {
      changeLoaderText("Transfering Token to "+e.bank_address);
      changeLoadingStatus(true);
      const response = await tokenController.transfer(e);
      if(response){
        toast("Token transfered to "+e.bank_address);
        setTimeout(() => {
          changeLoadingStatus(false);
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      alert("Error creating token " + error);
    }
  };

  if (!isLoggedIn || tokensAvailable === undefined) {
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
    <div className={styles["dashboard-container"]}>
      <div className={styles["dashboard__heading"]}>
        <h1 className={styles["dashboard-title"]}>{translatedText}</h1>
        <button onClick={()=>setOpenTransferTokenModal(true)}>Transfer Token</button>
      </div>
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
      {tokensAvailable !== undefined && (
        <TransferToken
          isOpen={openTransferTokenModal}
          handleClose={() => setOpenTransferTokenModal(false)}
          handleSubmit={(e) => onTransferToken(e)}
          allbanks={allBanks}
          tokens={tokensAvailable}
        />
      )}
    </div>
  );
}
