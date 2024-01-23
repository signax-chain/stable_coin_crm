import { Dialog } from "@mui/material";
import React, { ChangeEvent, useState } from "react";

import styles from "../../styles/modals/transfer_token.module.css";
import { XCircle } from "lucide-react";
import { IBankDetails } from "../../models/IBankDetails";
import { ITokenDetails, ITokenDisplay } from "../../models/ITokenDetail";
import { allBanks } from "../../helpers/Constants";
import { ITransferTokenFormData } from "../../models/IGeneralFormData";

export default function TransferToken(props: {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (e:ITransferTokenFormData) => void;
  allbanks: IBankDetails[];
  tokens: ITokenDisplay;
}) {
  const [formData, setFormData] = useState<ITransferTokenFormData>({
    token_name: props.tokens.title,
    total_supply: props.tokens.supply,
    bank_address: "",
    supply_to_be_sent: 0,
  });

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <Dialog maxWidth="md" open={props.isOpen} onClose={props.handleClose}>
        <div className={styles["transfer__token_container"]}>
          <div className={styles["transfer__token_heading"]}>
            <h3>Transfer Token Supplies</h3>
            <XCircle
              onClick={props.handleClose}
              size={30}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={styles["transfer__token_body"]}>
            <form className={styles["transfer__token_form"]}>
              <div className={styles["transfer__token_row"]}>
                <div className={styles["transfer__token_group"]}>
                  <p>Token Name</p>
                  <input
                    name="token_name"
                    value={props.tokens.title}
                    readOnly
                    disabled
                  />
                </div>
                <div className={styles["transfer__token_group"]}>
                  <p>Total Token Supply</p>
                  <input
                    name="token_supply"
                    value={props.tokens.supply}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className={styles["transfer__token_row"]}>
                <div className={styles["transfer__token_group"]}>
                  <p>Select Bank to Transfer</p>
                  <select
                    value={formData.bank_address}
                    name="bank_address"
                    onChange={onSelectChange}
                  >
                    <option>Select Bank</option>
                    {props.allbanks.map((bank, index) => {
                      return (
                        <option
                          key={index}
                          value={bank.bank_address}
                          className=""
                        >
                          {bank.bank_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className={styles["transfer__token_group"]}>
                  <p>Supply to be sent</p>
                  <input
                    name="supply_to_be_sent"
                    value={formData.supply_to_be_sent}
                    type="number"
                    onChange={inputChange}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className={styles["transfer__token_button_group"]}>
            <button
              className={styles["transfer__token_button"]}
              onClick={() => props.handleSubmit(formData)}
            >
              Transfer Token
            </button>
            <button
              className={styles["transfer__token_button_cancel"]}
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
