import React, { useContext, useEffect, useState } from "react";

import MintStableCoinModal from "../Modals/MintStableCoins";
import GradientInformationCard from "../Cards/GradientCard";
import {
  IContractDatabaseFormDetails,
  IInformationStats,
} from "../../models/IGeneralFormData";

import styles from "../../styles/coin_index.module.css";
import { STABLE_COIN_CONTRACT_ADDRESS } from "../../helpers/ContractAddress";
import { contractController } from "../../controllers/database/contract.controller";
import { IContractDatabaseDetails } from "../../models/IContractDetails";
import { INotificationDetails } from "../../models/INotifications";
import { useRoleFinder } from "../../context/RoleContextProvider";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import { notificationController } from "../../controllers/database/notification.controller";
import { toast } from "react-toastify";
import { userController } from "../../controllers/database/user.controller";
import { tokenController } from "../../controllers/token.controller";
import { IStableCoins } from "../../models/IStableCoins";
import { Timestamp } from "firebase/firestore";
import { bankDatabaseController } from "../../controllers/database/bank.controller";
import AccountContextProvider from "../../context/AccountContextProvider";

export default function CoinIndex() {
  const [openMintModal, setOpenMintModal] = useState(false);
  const [allBanks, setAllBanks] = useState<IContractDatabaseDetails[]>([]);
  const { userInformation } = useRoleFinder();
  const { data } = useContext(AccountContextProvider);
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  const [_, setData] = useState<IInformationStats[]>([]);
  const [allStableCoins, setAllStableCoins] = useState<IStableCoins[]>([]);

  useEffect(() => {
    async function getAllAvailableBanks() {
      await getAllStableCoin();
      contractController.getAllContractAddresses().then(async (value) => {
        let data: IContractDatabaseDetails[] = [];
        let info: IInformationStats[] = [];
        for (let index = 0; index < value.length; index++) {
          const element = value[index];
          const res = await userController.getUserById(element.user_id);
          if (res.length > 0) {
            let contractData: IContractDatabaseDetails = {
              contract_address: element.contract_address,
              user_id: element.user_id,
              token_details: {
                token_id: 0,
                token_name: res[0].name,
                token_description: "",
                token_supply: 0,
              },
              created_at: element.created_at,
              updated_at: element.updated_at,
              country: res[0].country,
            };
            data.push(contractData);
          }
        }
        let mergeData = [...info];
        setData(mergeData);
        setAllBanks(data);
      });
    }
    getAllAvailableBanks();
  }, []);

  const getAllStableCoin = async () => {
    try {
      changeLoaderText("Fetching all coins...");
      changeLoadingStatus(false);
      const response = await bankDatabaseController.getAllStableCoins();
      setAllStableCoins(response);
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    } catch (error) {
      toast("Error fetching all stable coins " + error, {
        type: "error",
        theme: "dark",
      });
    }
  };

  const mintCoinAddress = async (
    contractData: IContractDatabaseDetails,
    formData: IContractDatabaseFormDetails
  ) => {
    try {
      changeLoaderText("Minting Coin....");
      changeLoadingStatus(true);
      let notificationData: INotificationDetails = {
        creator_id: userInformation?.user_id!,
        notification_type: "request_token",
        is_resolved: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
      let response = await tokenController.mintToken(
        formData.supply,
        contractData.country!
      );
      if (response) {
        const userDetails = await userController.getUserById(
          contractData.user_id
        );
        let coinDetails: IStableCoins = {
          country: formData.country,
          supply_minted: formData.supply,
          creator_smart_contract_address: STABLE_COIN_CONTRACT_ADDRESS,
          receiver_smart_contract_address: contractData.contract_address,
          creator_wallet_address: data.address,
          creator_id: userInformation?.user_id!,
          bank_id: contractData.user_id,
          bank_details: {
            token_id: 0,
            bank_name: userDetails[0].name,
            bank_address: contractData.user_id,
            bank_user_extension: "",
            daily_max_transaction_amount: 0,
            daily_max_number_transaction: 0,
            supply: 0,
          },
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        };
        contractData.token_details.token_supply = coinDetails.supply_minted;
        await bankDatabaseController.createStableCoin(coinDetails);
        let res = await notificationController.createNotification(
          notificationData,
          userInformation?.user_id!,
          contractData,
          coinDetails
        );
        if (res) {
          setOpenMintModal(false);
          toast("Minted Successfully. Notification triggered to the bank", {
            type: "success",
          });
          setTimeout(() => {
            changeLoadingStatus(false);
          }, 3000);
        }
      }
    } catch (error) {
      toast("Minting Failed. Please try again ...." + error, {
        type: "error",
      });
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    }
  };

  return (
    <div className={styles["coin__index_container"]}>
      <div className={styles["coin__index_heading"]}>
        <h1 className={styles["coin__index_title"]}>Stable Coins</h1>
        <button
          className={styles["mint__heading_button"]}
          onClick={() => setOpenMintModal(true)}
        >
          Mint Stable Coins
        </button>
      </div>
      <div className={styles["coin__index_content"]}>
        {allStableCoins.length === 0 ? (
          <div className="no__data_container" style={{ marginTop: "10%" }}>
            <h3>
              No Stable Coins Minted. <br />
              Click on <strong>mint stable coin</strong> to mint a new stable
              coin
            </h3>
            <button onClick={() => setOpenMintModal(true)}>
              Mint Stable Coins
            </button>
          </div>
        ) : (
          <div className={styles["coin__stats"]}>
            {allStableCoins.map((info, index) => {
              let value: IInformationStats = {
                title: info.bank_details.bank_name,
                content: info.supply_minted.toString(),
                footer: [
                  {
                    title: "Country",
                    content: info.country,
                    footer: [],
                  },
                ],
              };
              return (
                <div key={index} className={styles["coin__card"]}>
                  <GradientInformationCard data={value} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <MintStableCoinModal
        isOpen={openMintModal}
        handleClose={() => setOpenMintModal(false)}
        handleSubmit={(
          e: IContractDatabaseDetails,
          d: IContractDatabaseFormDetails
        ) => mintCoinAddress(e, d)}
        allBanks={allBanks}
      />
    </div>
  );
}
