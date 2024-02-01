import { Dialog } from "@mui/material";
import React, { ChangeEvent, useState } from "react";

import styles from "../../styles/modals/add_bank.module.css";
import { XCircle } from "lucide-react";
import { allBanks } from "../../helpers/Constants";
import { IBankDetails } from "../../models/IBankDetails";

export default function AddBankModal(props: {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (e: IBankDetails) => void;
}) {
  const [createBankForm, setCreateFormData] = useState<IBankDetails>({
    token_id: +Date.now(),
    bank_name: "",
    bank_address: "",
    bank_user_extension: "",
    daily_max_transaction_amount: 0,
    daily_max_number_transaction: 0,
    supply: 0,
  });

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setCreateFormData({ ...createBankForm, [name]: value });
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setCreateFormData({ ...createBankForm, [name]: value });
  };

  return (
    <div>
      <Dialog open={props.isOpen} onClose={props.handleClose} maxWidth="md">
        <div className={styles["add__bank_modal"]}>
          <div className={styles["add__bank_heading"]}>
            <h3>Add a new bank</h3>
            <XCircle
              onClick={props.handleClose}
              size={30}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={styles["add__bank_details"]}>
            <form className={styles["add__bank_form"]}>
              <div className={styles["add__bank_row"]}>
                <div className={styles["add__bank_group"]}>
                  <p>Token ID</p>
                  <input
                    type="number"
                    readOnly
                    name="token_id"
                    defaultValue={createBankForm.token_id}
                  />
                </div>
                <div className={styles["add__bank_group"]}>
                  <p>Bank Name</p>
                  <select
                    name="bank_name"
                    value={createBankForm.bank_name}
                    onChange={onSelectChange}
                  >
                    <option>Select Bank</option>
                    {allBanks.map((bank, index) => {
                      return (
                        <option value={bank} key={index}>
                          {bank}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className={styles["add__bank_row"]}>
                <div className={styles["add__bank_group"]}>
                  <p>Bank Address</p>
                  <input
                    type="text"
                    name="bank_address"
                    value={createBankForm.bank_address}
                    onChange={inputChange}
                  />
                </div>
                <div className={styles["add__bank_group"]}>
                  <p>Bank User Extension (@hdfc, @sbi, etc)</p>
                  <input
                    type="text"
                    name="bank_user_extension"
                    value={createBankForm.bank_user_extension}
                    onChange={inputChange}
                  />
                  <span>
                    This is the extension displayed for user (user@hdfc)
                  </span>
                </div>
              </div>
              <h4 className={styles["h4"]}>Transaction Details</h4>
              <div className={styles["add__bank_row"]}>
                <div className={styles["add__bank_group"]}>
                  <p>Daily Max Transaction Amount</p>
                  <input
                    type="number"
                    name="daily_max_transaction_amount"
                    value={createBankForm.daily_max_transaction_amount}
                    onChange={inputChange}
                  />
                </div>
                <div className={styles["add__bank_group"]}>
                  <p>Daily Max Number of Transaction</p>
                  <input
                    type="text"
                    defaultValue={0}
                    name="daily_max_number_transaction"
                    value={createBankForm.daily_max_number_transaction}
                    onChange={inputChange}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className={styles["add__bank_button_group"]}>
            <button
              className={styles["add__bank_button"]}
              onClick={()=>props.handleSubmit(createBankForm)}
            >
              Add Bank
            </button>
            <button
              className={styles["add__bank_button_cancel"]}
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
