import React, { useContext } from "react";
import Popover from "@mui/material/Popover";
import {
  Bell,
  Copy,
  ExternalLink,
  Globe,
  Languages,
  User,
  Wallet,
} from "lucide-react";
import { Avatar, Badge } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AccountContextProvider from "../context/AccountContextProvider";
import { localStorageController } from "../controllers/storage.controller";
import { copyToClipboard } from "../helpers/GeneralFunc";
import { countryWithLanguages } from "../helpers/Constants";

import styles from "../styles/navbar.module.css";
import { useTranslation } from "../context/TranslatorContextProvider";
import { useRoleFinder } from "../context/RoleContextProvider";

export default function NavbarComponent(props: { onConnect: () => void }) {
  const { isLoggedIn, data } = useContext(AccountContextProvider);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [languageEl, setLanguageEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const isLanguageOpen = Boolean(languageEl);
  const languageModelId = isLanguageOpen ? "simple-popover" : undefined;

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const navigate = useNavigate();
  const { userInformation } = useRoleFinder();
  const { language, setLanguage } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLanguageEl(event.currentTarget);
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

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
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
      <Badge
        badgeContent={language}
        color="warning"
        aria-describedby={languageModelId}
        onClick={handleLanguageClick}
      >
        <Languages className={styles["notification"]} />
      </Badge>
      <Badge badgeContent={0} color="success">
        <Bell className={styles["notification"]} />
      </Badge>
      <Badge
        badgeContent={"New"}
        color="success"
        style={{ marginLeft: "30px" }}
      >
        {userInformation ? (
          <Avatar sx={{ bgcolor: "var(--primary-color)" }}>{userInformation.name[0]}</Avatar>
        ) : (
          <Avatar sx={{ bgcolor: "var(--primary-color)" }}>S</Avatar>
        )}
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
        {isLoggedIn && (
          <div className={styles["verify__entity_address"]}>
            <div className={styles["view__user_address"]}>
              <div className={styles["address"]}>
                <div className={styles["navbar__icon"]}>
                  <User color="white" size={20} strokeWidth="2.5px" />
                </div>
                <p>{data.address.substring(0, 28)}...</p>
              </div>
              <Link to={"/explorer/address/" + data.address}>
                <ExternalLink style={{ cursor: "pointer" }} />
              </Link>
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
                    localStorageController
                      .getData("contract_address")
                      .toString(),
                    "Contract Address"
                  )
                }
              />
            </div>
          </div>
        )}
      </Popover>
      <Popover
        id={languageModelId}
        open={isLanguageOpen}
        anchorEl={languageEl}
        onClose={() => setLanguageEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className={styles["language__list"]}>
          {countryWithLanguages.map((language, index) => {
            return (
              <div
                key={index}
                className={styles["langauge__tile"]}
                onClick={() => handleLanguageChange(language.languages[0])}
              >
                <img
                  src={`https://flagsapi.com/${language.alpha2Code}/shiny/64`}
                />
                <h3>{language.name}</h3>
              </div>
            );
          })}
        </div>
      </Popover>
    </div>
  );
}
