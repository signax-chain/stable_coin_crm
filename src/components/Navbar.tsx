import React, { useContext } from "react";

import { Bell, User, Wallet } from "lucide-react";
import { Badge } from "@mui/material";

import styles from "../styles/navbar.module.css";
import AccountContextProvider from "../context/AccountContextProvider";

export default function NavbarComponent(props: { onConnect: () => void }) {
  const { isLoggedIn, data } = useContext(AccountContextProvider);

  return (
    <div className={styles["navbar-container"]}>
      {isLoggedIn ? (
        <div className={styles["navbar__wallet_address"]}>
          <div className={styles["navbar__icon"]}>
            <User color="white" size={20} strokeWidth="2.5px" />
          </div>
          <div className={styles["navbar__details"]}>
            <h3>{data.address.substring(0, 20)}...</h3>
            <p>
              <strong>Balance: </strong>
              {data.balance.toPrecision(3)}ETH
            </p>
          </div>
        </div>
      ) : (
        <Wallet
          className={styles["notification"]}
          onClick={() => props.onConnect()}
        />
      )}
      <Badge badgeContent={0} color="success">
        <Bell className={styles["notification"]} />
      </Badge>
      <div style={{ marginRight: "30px" }}></div>
    </div>
  );
}
