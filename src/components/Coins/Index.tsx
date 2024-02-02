import React, { useContext, useEffect, useState } from "react";

import { bankController } from "../../controllers/bank.controller";
import { IBankDetails, ICentralBankDetails } from "../../models/IBankDetails";
import MintStableCoinModal from "../Modals/MintStableCoins";
import GradientInformationCard from "../Cards/GradientCard";
import { IInformationStats } from "../../models/IGeneralFormData";

import styles from "../../styles/coin_index.module.css";
import { CONTRACT_ADDRESS } from "../../helpers/Constants";
import { contractController } from "../../controllers/database/contract.controller";
import { IContractDatabaseDetails } from "../../models/IContractDetails";
import { INotificationDetails } from "../../models/INotifications";
import AccountContextProvider from "../../context/AccountContextProvider";
import { useRoleFinder } from "../../context/RoleContextProvider";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import { notificationController } from "../../controllers/database/notification.controller";
import { toast } from "react-toastify";

export default function CoinIndex() {
  const [openMintModal, setOpenMintModal] = useState(false);
  const [allBanks, setAllBanks] = useState<IContractDatabaseDetails[]>([]);
  const { userInformation } = useRoleFinder();
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  const [data, setData] = useState<IInformationStats[]>([
    {
      title: "Stable Coins Minted",
      content: "0",
      footer: [
        {
          title: "Total Countries",
          content: "0",
          footer: [],
        },
        {
          title: "Generated Value",
          content: "0",
          footer: [],
        },
      ],
    },
  ]);

  useEffect(() => {
    async function getAllAvailableBanks() {
      contractController.getAllContractAddresses().then((value) => {
        let data: IContractDatabaseDetails[] = value;
        let info: IInformationStats[] = [];
        for (let index = 0; index < value.length; index++) {
          const element = value[index];
          const data = {
            title: `${element.token_details.token_name}`,
            content: `${element.token_details.token_supply}`,
            footer: [
              {
                title: "Total Countries",
                content: "0",
                footer: [],
              },
              {
                title: "Generated Value",
                content: "0",
                footer: [],
              },
            ],
          };
          info.push(data);
        }
        let mergeData = [...info];
        setData(mergeData);
        setAllBanks(data);
      });
    }
    getAllAvailableBanks();
  }, []);

  const mintCoinAddress = async (contractData: IContractDatabaseDetails) => {
    try {
      changeLoaderText("Minting Coin....");
      changeLoadingStatus(true);
      let data: INotificationDetails = {
        creator_id: userInformation?.user_id!,
        notification_type: "request_token",
        is_resolved: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
      let res = await notificationController.createNotification(
        data,
        userInformation?.user_id!,
        contractData
      );
      if (res) {
        toast("Minted Successfully. Notification triggered to the bank", {
          type: "success",
        });
        setTimeout(() => {
          changeLoadingStatus(false);
        }, 3000);
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
        {data.length === 0 ? (
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
            {data.map((info, index) => {
              return (
                <div key={index} className={styles["coin__card"]}>
                  <GradientInformationCard data={info} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <MintStableCoinModal
        isOpen={openMintModal}
        handleClose={() => setOpenMintModal(false)}
        handleSubmit={(e:IContractDatabaseDetails) => mintCoinAddress(e)}
        allBanks={allBanks}
      />
    </div>
  );
}
