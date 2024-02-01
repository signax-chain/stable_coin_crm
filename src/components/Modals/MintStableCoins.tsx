import React, { useState } from "react";
import { Dialog } from "@mui/material";

import { IBankDetails, ICentralBankDetails } from "../../models/IBankDetails";

import styles from "../../styles/modals/mint_stable_coin.module.css";
import { XCircle } from "lucide-react";

export default function MintStableCoinModal(props: {
  isOpen: boolean;
  allBanks: ICentralBankDetails[];
  handleClose: () => void;
  handleSubmit: () => void;
}) {
  const [selectedSupply, setSelectedSupply] = useState(0);
  const [selectedContractAddress, setSelectedContractAddress] = useState("");

  return (
    <div>
      <Dialog open={props.isOpen} maxWidth="md">
        <div className={styles["mint__stable_coin_container"]}>
          <div className={styles["mint__stable_coin_heading"]}>
            <h3>Mint Stable Coin</h3>
            <XCircle
              onClick={props.handleClose}
              size={30}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={styles["mint__stable_coin_form"]}>
            <form className={styles["mint__stable_form"]}>
              <div className={styles["mint__stable_form_group"]}>
                <p>Select Token</p>
                <select
                  name="bank_name"
                  onChange={(e) => {
                    const { value } = e.target;
                    setSelectedSupply(Number(value.split("_")[1]));
                    setSelectedContractAddress(value.split("_")[0]);
                  }}
                >
                  <option value={`0_0`}>Select Token</option>
                  {props.allBanks.map((bank, index) => {
                    return (
                      <option key={index} value={`${bank.smart_contract_address}_${Number(bank.token_supply)}`}>
                        {bank.token_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              {selectedSupply !== 0 && (
                <div className={styles["mint__stable_form_group"]}>
                  <p>Stable Coins to Mint</p>
                  <input
                    name="mint_stable_coin"
                    value={selectedSupply}
                    readOnly
                  />
                </div>
              )}
            </form>
          </div>
          <div className={styles["mint__stable_button_group"]}>
            <button
              className={styles["mint__stable_button"]}
              onClick={() => {}}
            >
              Mint Coin
            </button>
            <button
              className={styles["mint__stable_button_cancel"]}
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
