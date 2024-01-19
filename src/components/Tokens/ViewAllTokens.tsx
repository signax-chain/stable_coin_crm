import React, { useState } from "react";

import styles from "../../styles/view_tokens.module.css";
import { Coins, Bitcoin, Landmark } from "lucide-react";
import AddToken from "../Modals/AddToken";

export default function ViewAllTokens() {
  const [stats, setStats] = useState([
    {
      title: "CBDCCoin",
      supply: "10000",
      supply_sent: "100",
      icon: <Coins color="white" size={70} strokeWidth="1.5px" />,
    },
    {
      title: "CBDCCoin Version 1",
      supply: "10000",
      supply_sent: "6000",
      icon: <Coins color="white" size={70} strokeWidth="1.5px" />,
    },
    {
      title: "CBDCCoin Version 2",
      supply: "10000",
      supply_sent: "1500",
      icon: <Coins color="white" size={70} strokeWidth="1.5px" />,
    },
    {
      title: "CBDCCoin Version 3",
      supply: "10000",
      supply_sent: "1000",
      icon: <Coins color="white" size={70} strokeWidth="1.5px" />,
    },
  ]);
  const [openCreateToken, setOpenCreateToken] = useState(false);

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
              <div className={styles["dashboard__stat"]} key={index}>
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
          handleSubmit={() => {}}
        />
      )}
    </div>
  );
}
