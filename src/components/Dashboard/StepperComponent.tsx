import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import styles from "../../styles/stepper_component.module.css";

export default function StepperComponent(props: {
  currentStep: number;
  changeStep: () => void;
}) {
  const steps = [
    "Connect Your Wallet",
    "Initialize Your Contract",
    "Add Your Token",
  ];

  return (
    <div className={styles["stepper__compo_container"]}>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={props.currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {props.currentStep === 1 ? (
          <div className={styles["steps__data"]}>
            <h3>
              Click on the <strong>connect wallet button</strong> to log in to
              your wallet
            </h3>
            <button onClick={() => {}}>Connect Wallet</button>
          </div>
        ) : props.currentStep === 2 ? (
          <div className={styles["steps__data"]}>
            <h3>
              Click on the <strong>initialize contract </strong> to initialize contract
            </h3>
            <button onClick={() => {}}>Initialize Contract</button>
          </div>
        ) : (
          <div className={styles["steps__data"]}>
            <h3>
              Click on the <strong>initialize your token</strong> to initialize token
            </h3>
            <button onClick={() => {}}>Initialize Token</button>
          </div>
        )}
      </Box>
    </div>
  );
}
