import React, { useContext, useEffect, useState } from "react";

import styles from "../../styles/view_tokens.module.css";
import { Coins, Bitcoin, Landmark } from "lucide-react";
import AddToken from "../Modals/AddToken";
import { tokenController } from "../../controllers/token.controller";
import { ITokenDetails, ITokenDisplay } from "../../models/ITokenDetail";
import { IBankDetails } from "../../models/IBankDetails";
import { bankController } from "../../controllers/bank.controller";
import TransferToken from "../Modals/TransferToken";
import { ITransferTokenFormData } from "../../models/IGeneralFormData";
import LoaderContextProvider from "../../context/LoaderContextProvider";

export default function ViewAllTokens() {
  const [stats, setStats] = useState<ITokenDisplay[]>([]);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [allBanks, setAllbanks] = useState<IBankDetails[]>([]);
  const [openCreateToken, setOpenCreateToken] = useState(false);
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  useEffect(() => {
    changeLoaderText("Fetching Tokens");
    changeLoadingStatus(true);
    tokenController.getAllToken().then((value) => {
      let v: ITokenDisplay[] = [];
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        let data: ITokenDisplay = {
          title: element.name,
          supply: element.supply,
          supply_sent: 0,
          icon: <Coins color="white" size={70} strokeWidth="1.5px" />,
          token_details: {
            token_id: element.token_id,
            token_description: "",
            token_name: element.name,
            token_supply: element.supply,
          },
        };
        v.push(data);
      }
      setStats(v);
    });
    bankController.getAllBanks().then((value) => {
      let allB: IBankDetails[] = [];
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        let data: IBankDetails = {
          bank_address: element.bank_address,
          token_id: element.bank_id,
          bank_name: element.name,
          bank_user_extension: element.extension,
          daily_max_number_transaction: 0,
          daily_max_transaction_amount: 0,
        };
        allB.push(data);
      }
      setAllbanks(allB);
    });
    setTimeout(() => {
      changeLoaderText("Fetching Tokens");
      changeLoadingStatus(false);
    }, 3000);
  }, []);

  const createToken = async (data: ITokenDetails) => {
    try {
      changeLoaderText("Creating Token");
      changeLoadingStatus(true);
      const res = await tokenController.createToken(data, "");
      if(res){
        setOpenCreateToken(false);
        setTimeout(() => {
          changeLoadingStatus(false);
          alert("Token Created Successfully");
        }, 3000);
      }else{
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

  const onTokenClick = (index: number) => {
    setSelectedTokenIndex(index);
    setOpenTransferDialog(true);
  };

  const onTransferToken = (e: ITransferTokenFormData) => {
    try {
    } catch (error) {
      alert("Error creating token " + error);
    }
  };

  return (
    <div className={styles["view__all_tokens_container"]}>
      <div className={styles["view__heading"]}>
        <h1 className={styles["view__all_title"]}>View All Tokens</h1>
        <button
          className={styles["create__token_button"]}
          onClick={() => setOpenCreateToken(true)}
        >
          Create Token
        </button>
      </div>
      <div className={styles["view__all_token_list"]}>
        <div className={styles["view__all_token"]}>
          {stats.map((stat, index) => {
            return (
              <div
                className={styles["dashboard__stat"]}
                key={index}
                onClick={() => onTokenClick(index)}
              >
                <div className={styles["dashboard__icon"]}>{stat.icon}</div>
                <div className={styles["dashboard__stats_data"]}>
                  <h3 className={styles["dashboard__stats_title"]}>
                    {stat.title}
                  </h3>
                  <div className={styles["view__all_subtitle"]}>
                    <div className={styles["view__all_group"]}>
                      <p>Total Supply</p>
                      <p>{stat.supply} tokens</p>
                    </div>
                    <div className={styles["view__all_group"]}>
                      <p>Supply Sent</p>
                      <p>{stat.supply_sent} tokens</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {openCreateToken && (
        <AddToken
          isOpen={openCreateToken}
          handleClose={() => setOpenCreateToken(false)}
          handleSubmit={(e: ITokenDetails) => createToken(e)}
        />
      )}
      {openTransferDialog && allBanks.length > 0 && (
        <TransferToken
          isOpen={openTransferDialog}
          handleClose={() => setOpenTransferDialog(false)}
          handleSubmit={(e: ITransferTokenFormData) => onTransferToken(e)}
          allbanks={allBanks}
          tokens={stats[selectedTokenIndex]}
        />
      )}
    </div>
  );
}
