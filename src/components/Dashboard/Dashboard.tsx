import React, { useContext, useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import { toast } from "react-toastify";

import AccountContextProvider from "../../context/AccountContextProvider";
import { walletController } from "../../controllers/wallet.controller";
import {
  IInformationStats,
  ITransferTokenFormData,
  IWalletData,
} from "../../models/IGeneralFormData";
import { localStorageController } from "../../controllers/storage.controller";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import { tokenController } from "../../controllers/token.controller";
import { ITokenDetails } from "../../models/ITokenDetail";
import AddToken from "../Modals/AddToken";
import GradientInformationCard from "../Cards/GradientCard";
import { useTranslation } from "../../context/TranslatorContextProvider";
import { IBankDetails } from "../../models/IBankDetails";
import { bankController } from "../../controllers/bank.controller";
import TransferToken from "../Modals/TransferToken";
import { userController } from "../../controllers/database/user.controller";
import { useRoleFinder } from "../../context/RoleContextProvider";
import StepperComponent from "./StepperComponent";
import { IContractDatabaseDetails } from "../../models/IContractDetails";
import { contractController } from "../../controllers/database/contract.controller";

import styles from "../../styles/dashboard.module.css";

export default function DashboardComponent() {
  const [stats, setStats] = useState<IInformationStats[]>([
    {
      title: "Available Tokens",
      content: "0",
      footer: [],
    },
    {
      title: "Total Supply",
      content: "$0",
      footer: [],
    },
    {
      title: "Available Banks",
      content: "0",
      footer: [],
    },
    {
      title: "Total Users",
      content: "0",
      footer: [],
    },
    {
      title: "Transactions per month",
      content: "0",
      footer: [],
    },
    {
      title: "Available Banks",
      content: "0",
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
  const { userInformation, role } = useRoleFinder();
  const [currentStep, setCurrentStep] = useState(1);
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
    if (role.role !== "team") {
      getContractAddress();
      contractController
        .getContractByBankId(userInformation?.user_id!)
        .then((value) => {
          localStorageController.setData(
            "contract_address",
            value!.contract_address
          );
        });
    }
  }, []);

  const getContractAddress = async () => {
    try {
      const address = localStorageController.getData("wallet");
      const contract_address =
        localStorageController.getData("contract_address");
      if (address) {
        changeLoaderText("Fetching Tokens....");
        changeLoadingStatus(true);
        const data: IWalletData = JSON.parse(address);
        const tokenData = await tokenController.getAllToken(data!.data.address);
        const balance = await bankController.getBalanceOf(
          data!.data.address,
          contract_address
        );
        const allBanks = await bankController.getAllBanks(contract_address);
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
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    }
  };

  const connectWallet = async (i: number) => {
    const res = await walletController.connectWallet();
    if (res.isConnected) {
      let userData = { ...userInformation };
      userData.address = res.address!;
      userData.created_at = new Date();
      userData.updated_at = new Date();
      await userController.updateUserDetails(userData.user_id!, userData);
      changeLogInStatus(res.isConnected);
      setCurrentStep(i);
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
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address) {
        toast("No contract Initialization Found!!", {
          type: "error",
        });
      }
      changeLoaderText("Initializing Token");
      changeLoadingStatus(true);
      const res = await tokenController.createToken(
        tokenData,
        contract_address,
        data.address
      );
      if (res) {
        const response: IContractDatabaseDetails = {
          contract_address: contract_address,
          user_id: userInformation?.user_id!,
          token_details: tokenData,
          created_at: new Date(),
          updated_at: new Date(),
          country: "",
        };
        await contractController.createUserContractCollection(response);
        setOpenCreateToken(false);
        toast("Token created successfully", {
          type: "success",
        });
        setTimeout(async () => {
          changeLoadingStatus(false);
          await getContractAddress();
        }, 3000);
      } else {
        toast("Token creation failed", {
          type: "error",
        });
        setTimeout(() => {
          changeLoadingStatus(false);
        }, 3000);
      }
    } catch (error) {
      changeLoadingStatus(false);
      toast("Token creation failed " + error, {
        type: "error",
      });
    }
  };

  const onTransferToken = async (e: ITransferTokenFormData) => {
    try {
      changeLoaderText("Transfering Token");
      changeLoadingStatus(true);
      const response = await tokenController.transfer(e);
      if (response) {
        let selectedData: IContractDatabaseDetails | undefined =
          await contractController.getContractByBankId(
            userInformation?.user_id!
          );
        selectedData!.token_details.token_supply -= e.supply_to_be_sent;
        selectedData!.updated_at = new Date();
        await contractController.updateUserContractCollection(
          selectedData!.user_id,
          selectedData!
        );
        toast("Token transfered to " + e.bank_address, {
          type: "success",
          theme: "dark",
        });
        setTimeout(() => {
          changeLoadingStatus(false);
          getContractAddress();
        }, 3000);
      }
    } catch (error) {
      alert("Error creating token " + error);
    }
  };

  const deployContract = async () => {
    try {
      const contract_address = await walletController.deployContract();
      if (contract_address) {
        localStorageController.setData("contract_address", contract_address);
        setCurrentStep(3);
      }
    } catch (error) {
      toast("Error deploying contract " + error, {
        type: "error",
      });
    }
  };

  if (!isLoggedIn && role.role === "central_bank") {
    return (
      <div className={styles["stepper__compo_main"]}>
        <StepperComponent
          currentStep={currentStep}
          changeStep={(e: number) => setCurrentStep(e)}
          connectWallet={(i: number) => connectWallet(i)}
          tokenCreationModal={() => setOpenCreateToken(true)}
          deployContract={() => deployContract()}
          role={role.role}
        />
      </div>
    );
  }

  if (!isLoggedIn && role.role === "team") {
    return (
      <div className={styles["stepper__compo_main"]}>
        <StepperComponent
          currentStep={currentStep}
          changeStep={(e: number) => setCurrentStep(e)}
          connectWallet={(i: number) => connectWallet(i)}
          tokenCreationModal={() => setOpenCreateToken(true)}
          deployContract={() => deployContract()}
          role={role.role}
        />
        <AddToken
          isOpen={openCreateToken}
          handleClose={() => setOpenCreateToken(false)}
          handleSubmit={(e: ITokenDetails) => createToken(e)}
          mintedCoin={undefined}
        />
      </div>
    );
  }

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["dashboard__heading"]}>
        <h1 className={styles["dashboard-title"]}>{translatedText}</h1>
        {role.role === "central_bank" && (
          <button onClick={() => setOpenTransferTokenModal(true)}>
            Transfer Token
          </button>
        )}
      </div>
      <div className={styles["dashboard__stats"]}>
        <div className={styles["dashboard__basic_stats"]}>
          {stats.map((stat, index) => {
            return (
              <div className={styles["dashboard__card"]} key={index}>
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
