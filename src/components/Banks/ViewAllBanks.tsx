import React, { useContext, useEffect, useState } from "react";
import { Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

import GeneralCard from "../Cards/GeneralCard";
import { IBankDetails, IBankDisplay } from "../../models/IBankDetails";
import { bankController } from "../../controllers/bank.controller";
import AddBankModal from "../Modals/AddBank";
import { localStorageController } from "../../controllers/storage.controller";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import AccountContextProvider from "../../context/AccountContextProvider";
import { walletController } from "../../controllers/wallet.controller";
import { IWalletData } from "../../models/IGeneralFormData";

import styles from "../../styles/banks.module.css";
import { useTranslation } from "../../context/TranslatorContextProvider";
import { CONTRACT_ADDRESS } from "../../helpers/Constants";

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
    bankController.getAllBanks().then(async (value) => {
      let v: IBankDisplay[] = [];
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        const balance = await bankController.getBalanceOf(element.bank_address, CONTRACT_ADDRESS);
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
        console.log(data)
        v.push(data);
      }
      setBankData(v);
    });
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

  const createBank = async (data: IBankDetails) => {
    try {
      changeLoaderText("Adding new bank");
      changeLoadingStatus(true);
      const res = await bankController.createBank(data);
      if (res) {
        setOpenCreateBank(false);
        changeLoadingStatus(false);
        await getAllBanksAvailable();
        alert(`Added ${data.bank_name} successfully`);
      } else {
        changeLoadingStatus(false);
        alert("Adding bank failed");
      }
    } catch (error) {
      changeLoadingStatus(false);
      alert("Bank creation failed " + error);
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
        <button
          className={styles["create__bank_button"]}
          onClick={() => setOpenCreateBank(true)}
        >
          Add a Bank
        </button>
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
