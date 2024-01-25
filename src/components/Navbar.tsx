import React, { ChangeEvent, useContext } from "react";
import Popover from "@mui/material/Popover";
import { Bell, Copy, Globe, User, Wallet } from "lucide-react";
import { Badge } from "@mui/material";

import styles from "../styles/navbar.module.css";
import AccountContextProvider from "../context/AccountContextProvider";
import { useNavigate } from "react-router-dom";
import { localStorageController } from "../controllers/storage.controller";
import { copyToClipboard } from "../helpers/GeneralFunc";
import { toast } from "react-toastify";

export default function NavbarComponent(props: { onConnect: () => void }) {
  const { isLoggedIn, data } = useContext(AccountContextProvider);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToExplorer = () => {
    navigate("/explorer");
  };

  const clipBoardCopy = (txt: string, type: string) => {
    const res = copyToClipboard(txt);
    if (res) {
      toast(`${type} copied to your clipboard`);
    }
  };

  return (
    <div className={styles["navbar-container"]}>
      {isLoggedIn ? (
        <button
          className={styles["navbar__wallet_address"]}
          onClick={handleClick}
        >
          <div className={styles["navbar__icon"]}>
            <User color="white" size={20} strokeWidth="2.5px" />
          </div>
          <div className={styles["navbar__details"]}>
            <h3>{data.address.substring(0, 20)}...</h3>
            <p>
              <strong>Contract: </strong>
              {localStorageController
                .getData("contract_address")
                .substring(0, 13)}
              ...
            </p>
            <p>
              <strong>Balance: </strong>
              {data.balance.toPrecision(3)}ETH
            </p>
          </div>
        </button>
      ) : (
        <Wallet
          className={styles["notification"]}
          onClick={() => props.onConnect()}
        />
      )}
      <Globe
        className={styles["notification"]}
        onClick={() => navigateToExplorer()}
      />
      <Badge badgeContent={0} color="success">
        <Bell className={styles["notification"]} />
      </Badge>
      <div style={{ marginRight: "30px" }}></div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className={styles["verify__entity_address"]}>
          <div className={styles["view__user_address"]}>
            <div className={styles["address"]}>
              <div className={styles["navbar__icon"]}>
                <User color="white" size={20} strokeWidth="2.5px" />
              </div>
              <p>{data.address.substring(0, 28)}...</p>
            </div>
            <Copy
              style={{ cursor: "pointer" }}
              onClick={() =>
                clipBoardCopy(data.address.toString(), "Wallet Address")
              }
            />
          </div>
          <div className={styles["view__user_address"]}>
            <div className={styles["address"]}>
              <div className={styles["navbar__icon"]}>
                <User color="white" size={20} strokeWidth="2.5px" />
              </div>
              <p>
                {localStorageController
                  .getData("contract_address")
                  .substring(0, 28)}
                ...
              </p>
            </div>
            <Copy
              style={{ cursor: "pointer" }}
              onClick={() =>
                clipBoardCopy(
                  localStorageController.getData("contract_address").toString(),
                  "Contract Address"
                )
              }
            />
          </div>
        </div>
      </Popover>
    </div>
  );
}
