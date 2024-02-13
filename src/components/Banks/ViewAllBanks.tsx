import React, { useContext, useEffect, useState } from "react";
import { Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

import GeneralCard from "../Cards/GeneralCard";
import {
  IBankDatabaseDetails,
  IBankDetails,
  IBankDisplay,
} from "../../models/IBankDetails";
import { bankController } from "../../controllers/bank.controller";
import AddBankModal from "../Modals/AddBank";
import { localStorageController } from "../../controllers/storage.controller";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import AccountContextProvider from "../../context/AccountContextProvider";
import { walletController } from "../../controllers/wallet.controller";
import { IWalletData } from "../../models/IGeneralFormData";

import styles from "../../styles/banks.module.css";
import { useTranslation } from "../../context/TranslatorContextProvider";
import { CONTRACT_ADDRESS } from "../../helpers/ContractAddress";
import { toast } from "react-toastify";
import { bankDatabaseController } from "../../controllers/database/bank.controller";
import { useRoleFinder } from "../../context/RoleContextProvider";

export default function ViewAllBankComponents() {
  const navigate = useNavigate();
  const { translate, language } = useTranslation();
  const [bankData, setBankData] = useState<IBankDisplay[]>([]);
  const [openCreateBank, setOpenCreateBank] = useState(false);
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  const [translateText, setTranslatedText] = useState("View All Banks");
  const { isLoggedIn, changeContent, changeLogInStatus } = useContext(
    AccountContextProvider
  );
  const { data } = useContext(AccountContextProvider);
  const { role } = useRoleFinder();

  useEffect(() => {
    async function getBanks() {
      await getAllBanksAvailable();
    }
    getBanks();
  }, []);

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const result = await translate(translateText, language);
        setTranslatedText(result);
      } catch (error) {
        console.error("Error fetching translation:", error);
      }
    };
    fetchTranslation();
  }, [language]);

  const getAllBanksAvailable = async () => {
    changeLoaderText("Fetching All Banks");
    changeLoadingStatus(true);
    if (role.role !== "team") {
      let contract_address = localStorageController.getData("contract_address");
      bankController.getAllBanks(contract_address).then(async (value) => {
        let v: IBankDisplay[] = [];
        for (let index = 0; index < value.length; index++) {
          const element = value[index];
          const balance = await bankController.getBalanceOf(
            element.bank_address,
            undefined
          );
          let data: IBankDisplay = {
            title: element.bank_name,
            subtitle: element.bank_address,
            icon: <Landmark color="white" size={40} strokeWidth="1.5px" />,
            supply: balance,
            bank_details: {
              bank_address: element.bank_address,
              token_id: Number(element.token_id),
              bank_name: element.bank_name,
              bank_user_extension: element.bank_user_extension,
              daily_max_number_transaction: 0,
              daily_max_transaction_amount: 0,
              supply: balance,
            },
          };
          v.push(data);
        }
        setBankData(v);
      });
    } else {
      bankDatabaseController.getAllBanks().then(async (banks) => {
        let bankData: IBankDisplay[] = [];
        for (let index = 0; index < banks.length; index++) {
          const element = banks[index];
          const balance = await bankController.getBalanceOf(
            element.bank_details.bank_address,
            element.smart_contract_address
          );
          let data: IBankDisplay = {
            title: element.bank_details.bank_name,
            subtitle: element.bank_details.bank_address,
            icon: <Landmark color="white" size={40} strokeWidth="1.5px" />,
            supply: balance,
            bank_details: {
              bank_address: element.bank_details.bank_address,
              token_id: Number(element.bank_details.token_id),
              bank_name: element.bank_details.bank_name,
              bank_user_extension: element.bank_details.bank_user_extension,
              daily_max_number_transaction: 0,
              daily_max_transaction_amount: 0,
              supply: balance,
            },
          };
          bankData.push(data);
        }
        setBankData(bankData);
      });
    }
    setTimeout(() => {
      changeLoadingStatus(false);
    }, 3000);
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

  if (!isLoggedIn) {
    return (
      <div className="no__data_container">
        <h3>
          Click on the <strong>connect wallet button</strong> to log in to your
          wallet
        </h3>
        <button onClick={() => connectWallet()}>Connect Wallet</button>
      </div>
    );
  }

  const createBank = async (bank: IBankDetails) => {
    try {
      changeLoaderText("Adding new bank");
      changeLoadingStatus(true);
      const res = await bankController.createBank(bank);
      if (res) {
        const contract_address =
          localStorageController.getData("contract_address");
        let storedData: IBankDatabaseDetails = {
          smart_contract_address: contract_address,
          creator: data.address,
          bank_details: bank,
          created_at: new Date(),
          updated_at: new Date(),
        };
        await bankDatabaseController.createBanks(storedData);
        setOpenCreateBank(false);
        changeLoadingStatus(false);
        await getAllBanksAvailable();
        toast(`Added ${bank.bank_name} successfully`, {
          type: "success",
        });
      } else {
        changeLoadingStatus(false);
        toast(`Adding bank failed`, {
          type: "error",
        });
      }
    } catch (error) {
      changeLoadingStatus(false);
      toast("Bank creation failed " + error, {
        type: "error",
      });
    }
  };

  const onBankViewClick = (data: IBankDetails) => {
    localStorageController.setData(
      data.token_id.toString(),
      JSON.stringify(data)
    );
    navigate("" + data.token_id);
  };

  if (bankData.length === 0) {
    return (
      <div className="no__data_container">
        <h3>
          No Banks Added. Click on <strong>add bank</strong>.
        </h3>
        <button onClick={() => setOpenCreateBank(true)}>Add a Bank</button>
        {openCreateBank && (
          <AddBankModal
            isOpen={openCreateBank}
            handleSubmit={(e: IBankDetails) => createBank(e)}
            handleClose={() => {
              setOpenCreateBank(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles["bank__container"]}>
      <div className={styles["bank__header"]}>
        <h1 className={styles["bank__title"]}>{translateText}</h1>
        {role.role === "central_bank" && (
          <button
            className={styles["create__bank_button"]}
            onClick={() => setOpenCreateBank(true)}
          >
            Add a Bank
          </button>
        )}
      </div>
      <div className={styles["bank__list"]}>
        <div className={styles["bank__lists"]}>
          {bankData.map((bank, index) => {
            return (
              <div
                className={styles["bank__card"]}
                key={index}
                onClick={() => onBankViewClick(bank.bank_details)}
              >
                <GeneralCard
                  key={index}
                  title={bank.title}
                  subtitle={`Available Tokens: ${bank.supply}`}
                  icon={bank.icon}
                  children={<div></div>}
                  needAlignment={true}
                />
              </div>
            );
          })}
        </div>
      </div>
      {openCreateBank && (
        <AddBankModal
          isOpen={openCreateBank}
          handleSubmit={(e: IBankDetails) => createBank(e)}
          handleClose={() => {
            setOpenCreateBank(false);
          }}
        />
      )}
    </div>
  );
}
