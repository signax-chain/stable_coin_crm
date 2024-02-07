import React, { useState } from "react";
import { Dialog } from "@mui/material";

import styles from "../../styles/modals/mint_stable_coin.module.css";
import { XCircle } from "lucide-react";
import { IContractDatabaseDetails } from "../../models/IContractDetails";
import { IContractDatabaseFormDetails } from "../../models/IGeneralFormData";

export default function MintStableCoinModal(props: {
  isOpen: boolean;
  allBanks: IContractDatabaseDetails[];
  handleClose: () => void;
  handleSubmit: (e: IContractDatabaseDetails, d: IContractDatabaseFormDetails) => void;
}) {
  const [selectedSupply, setSelectedSupply] = useState(0);
  const [selectedContractAddress, setSelectedContractAddress] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [formData, setFormData] = useState<IContractDatabaseFormDetails>({
    country: "",
    supply: 0,
    bank_details: {
      token_id: 0,
      bank_name: "",
      bank_address: "",
      bank_user_extension: "",
      daily_max_transaction_amount: 0,
      daily_max_number_transaction: 0,
      supply: 0
    }
  });

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
                    setSelectedContractAddress(value.split("_")[0]);
                    setSelectedIndex(Number(value.split("_")[2]));
                    setFormData({...formData, country: value.split("_")[3]});
                  }}
                >
                  <option value={`0_0`}>Select Token</option>
                  {props.allBanks.map((bank, index) => {
                    return (
                      <option
                        key={index}
                        value={`${bank.contract_address}_${Number(
                          bank.token_details.token_name
                        )}_${index}_${bank.country}`}
                      >
                        {bank.token_details.token_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={styles["mint__stable_form_group"]}>
                <p>Stable Coins to Mint</p>
                <input
                  name="mint_stable_coin"
                  value={selectedSupply}
                  onChange={(e) => {
                    setSelectedSupply(Number(e.target.value));
                    setFormData({...formData, supply: Number(e.target.value)});
                  }}
                />
              </div>
            </form>
          </div>
          <div className={styles["mint__stable_button_group"]}>
            <button
              className={styles["mint__stable_button"]}
              onClick={() => props.handleSubmit(props.allBanks[selectedIndex], formData)}
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
