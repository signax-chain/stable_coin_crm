import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Check, Coins, ReceiptText, Wallet } from "lucide-react";
import { StepIconProps } from "@mui/material";
import styled from "@emotion/styled";

import styles from "../../styles/stepper_component.module.css";
import AccountContextProvider from "../../context/AccountContextProvider";
import { localStorageController } from "../../controllers/storage.controller";

export default function StepperComponent(props: {
  currentStep: number;
  changeStep: (e: number) => void;
  connectWallet: (e: number) => void;
  tokenCreationModal: () => void;
  deployContract: () => void;
  role: "user" | "central_bank" | "bank" | "team" | undefined;
}) {
  const { data } = useContext(AccountContextProvider);

  const StyledStepLabel = styled(StepLabel)({
    "& .MuiStepLabel-label": {
      color: "var(--primary-text-color)",
      fontFamily: "var(--primary-font)",
      fontWeight: "600",
    },
  });

  function ConnectWalletIcon(props: StepIconProps) {
    const { completed, className } = props;
    return (
      <div className={`${styles["stepper__icon"]} ${className}`}>
        {completed ? (
          <Check color="white" strokeWidth="2.5px" />
        ) : (
          <Wallet color="white" strokeWidth="2.5px" />
        )}
      </div>
    );
  }

  function InitializeContract(props: StepIconProps) {
    const { completed, className } = props;
    return (
      <div className={`${styles["stepper__icon"]} ${className}`}>
        {completed ? (
          <Check color="white" strokeWidth="2.5px" />
        ) : (
          <ReceiptText color="white" strokeWidth="2.5px" />
        )}
      </div>
    );
  }

  function InitializeToken(props: StepIconProps) {
    const { completed, className } = props;
    return (
      <div className={`${styles["stepper__icon"]} ${className}`}>
        {completed ? (
          <Check color="white" strokeWidth="2.5px" />
        ) : (
          <Coins color="white" strokeWidth="2.5px" />
        )}
      </div>
    );
  }

  return (
    <div className={styles["stepper__compo_container"]}>
      <Box sx={{ width: "100%" }}>
        {props.role === "team" ? (
          <div></div>
        ) : (
          <Stepper activeStep={props.currentStep}>
            {/* <Step key={1}>
              <StyledStepLabel StepIconComponent={ConnectWalletIcon}>
                Connect Your Wallet
              </StyledStepLabel>
            </Step> */}
            {/* <Step key={2}>
              <StyledStepLabel StepIconComponent={InitializeContract}>
                Initialize Contract
              </StyledStepLabel>
            </Step>
            <Step key={3}>
              <StyledStepLabel StepIconComponent={InitializeToken}>
                Initialize Token
              </StyledStepLabel>
            </Step> */}
          </Stepper>
        )}
        <div className={styles["steps__data"]}>
          <h3>
            Click on the <strong>connect wallet button</strong> to log in to
            your wallet
          </h3>
          <button onClick={() => props.connectWallet(2)}>Connect Wallet</button>
        </div>
      </Box>
    </div>
  );
}
