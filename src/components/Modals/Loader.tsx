import { CircularProgress, Dialog } from "@mui/material";
import React from "react";

import styles from "../../styles/modals/loader.module.css";

export default function Loader(props: {
  isOpen: boolean;
  loaderText: string | "Loading...";
}) {
  return (
    <div>
      <Dialog
        className={styles["modal"]}
        open={props.isOpen}
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "20px",
          },
        }}
      >
        <div className={styles["modal__body"]}>
          <h2>{props.loaderText}</h2>
          <CircularProgress color="warning" size={100} />
        </div>
      </Dialog>
    </div>
  );
}
