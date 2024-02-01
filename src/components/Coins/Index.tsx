import React, { useEffect, useState } from "react";

import { bankController } from "../../controllers/bank.controller";
import { IBankDetails, ICentralBankDetails } from "../../models/IBankDetails";
import MintStableCoinModal from "../Modals/MintStableCoins";
import GradientInformationCard from "../Cards/GradientCard";
import { IInformationStats } from "../../models/IGeneralFormData";

import styles from "../../styles/coin_index.module.css";
import { CONTRACT_ADDRESS } from "../../helpers/Constants";

export default function CoinIndex() {
  const [openMintModal, setOpenMintModal] = useState(false);
  const [allBanks, setAllBanks] = useState<ICentralBankDetails[]>([]);
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
      bankController.getAllCentralBankData(CONTRACT_ADDRESS).then((value) => {
        setAllBanks(value);
        let info:IInformationStats[] = [];
        for (let index = 0; index < value.length; index++) {
          const element = value[index];
          const data =   {
            title: `${element.token_name}`,
            content: `${element.token_supply}`,
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
      });
    }
    getAllAvailableBanks();
  }, []);

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
        <div className={styles["coin__stats"]}>
          {data.map((info, index) => {
            return (
              <div key={index} className={styles["coin__card"]}>
                <GradientInformationCard data={info} />
              </div>
            );
          })}
        </div>
      </div>
      <MintStableCoinModal
        isOpen={openMintModal}
        handleClose={() => setOpenMintModal(false)}
        handleSubmit={() => {}}
        allBanks={allBanks}
      />
    </div>
  );
}
