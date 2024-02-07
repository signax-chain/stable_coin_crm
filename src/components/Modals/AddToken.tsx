import { Dialog } from "@mui/material";
import React, { ChangeEvent, useState } from "react";

import styles from "../../styles/modals/add_token.module.css";
import { XCircle } from "lucide-react";
import { ITokenDetails } from "../../models/ITokenDetail";
import { IStableCoins } from "../../models/IStableCoins";

export default function AddToken(props: {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (e:ITokenDetails) => void;
  mintedCoin: IStableCoins | undefined;
}) {
  const [createToken, setCreateToken] = useState<ITokenDetails>({
    token_id: +Date.now(),
    token_description: "",
    token_name: "",
    token_supply: 0,
  });

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setCreateToken({ ...createToken, [name]: value });
  };

  const onTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setCreateToken({ ...createToken, [name]: value });
  };

  return (
    <div>
      <Dialog open={props.isOpen} onClose={props.handleClose} maxWidth="md">
        <div className={styles["add__token_modal"]}>
          <div className={styles["add__token_heading"]}>
            <h3>Mint New Token</h3>
            <XCircle
              onClick={props.handleClose}
              size={30}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={styles["add__token_details"]}>
            <div className={styles["add__token_form"]}>
              <div className={styles["add__token_row"]}>
                <div className={styles["add__token_group"]}>
                  <p>Token ID</p>
                  <input
                    type="number"
                    name="token_id"
                    value={createToken.token_id}
                    readOnly
                  />
                </div>
                <div className={styles["add__token_group"]}>
                  <p>Token Name</p>
                  <input
                    type="text"
                    name="token_name"
                    value={createToken.token_name}
                    onChange={inputChange}
                  />
                </div>
              </div>
              <div className={styles["add__token_row"]}>
                <div className={styles["add__token_group"]}>
                  <p>Token Supply</p>
                  <input
                    type="number"
                    name="token_supply"
                    value={props.mintedCoin !== undefined ? props.mintedCoin.supply_minted :createToken.token_supply}
                    onChange={inputChange}
                    readOnly={props.mintedCoin !== undefined}
                  />
                </div>
                <div className={styles["add__token_group"]}>
                  <p>Token Description</p>
                  <textarea
                    name="token_description"
                    value={createToken.token_description}
                    onChange={onTextareaChange}
                    rows={3}
                  />
                </div>
              </div>
              {/* <div className={styles["add__token_textarea_group"]}>
                <p>Token Description</p>
                <textarea
                  name="token_description"
                  value={createToken.token_description}
                  onChange={onTextareaChange}
                  rows={4}
                />
              </div> */}
            </div>
          </div>
          <div className={styles["add__token_button_group"]}>
            <button className={styles["add__token_button"]} onClick={()=>props.handleSubmit(createToken)}>
              Add New Token
            </button>
            <button
              className={styles["add__token_button_cancel"]}
              onClick={props.handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
