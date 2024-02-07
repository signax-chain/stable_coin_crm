import { Dialog } from "@mui/material";
import React, { ChangeEvent, useState } from "react";

import styles from "../../styles/modals/add_central_bank.module.css";
import { XCircle } from "lucide-react";
import { sortArrayAscending } from "../../helpers/Country";
import { countryData } from "../../helpers/Constants";
import { ICentralBankFormDetails } from "../../models/IBankDetails";

export default function AddCentralBank(props: {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (e:ICentralBankFormDetails) => void;
}) {
  const [createBankForm, setCreateFormData] = useState<ICentralBankFormDetails>(
    {
      name: "",
      symbol: "",
      contract_address: "",
      country: "",
      email_address: "",
      password: "",
    }
  );

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
      <Dialog open={props.isOpen} maxWidth="md">
        <div className={styles["add__central_bank_modal"]}>
          <div className={styles["add__central_bank_heading"]}>
            <h3>Add New Central Bank</h3>
            <XCircle
              onClick={props.handleClose}
              size={30}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={styles["add__central_bank_details"]}>
            <form className={styles["add__central_bank_form"]}>
              <div className={styles["add__central_bank_row"]}>
                <div className={styles["add__central_bank_group"]}>
                  <p>Central Bank Name</p>
                  <input
                    type="text"
                    name="name"
                    onChange={inputChange}
                    value={createBankForm.name}
                  />
                </div>
                <div className={styles["add__central_bank_group"]}>
                  <p>Currency Symbol</p>
                  <input
                    type="text"
                    name="symbol"
                    onChange={inputChange}
                    value={createBankForm.symbol}
                  />
                </div>
              </div>
              <div className={styles["add__central_bank_row"]}>
                <div className={styles["add__central_bank_group"]}>
                  <p>Select Country</p>
                  <select
                    className="form-control"
                    name="country"
                    onChange={onSelectChange}
                    value={createBankForm.country}
                  >
                    {sortArrayAscending(countryData).map(
                      (country: any, index: number) => {
                        return (
                          <option key={index} value={country.name.common}>
                            {country.name.common}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
                <div className={styles["add__central_bank_group"]}>
                  <p>Bank Contract Address</p>
                  <input
                    type="text"
                    name="contract_address"
                    onChange={inputChange}
                    value={createBankForm.contract_address}
                  />
                </div>
              </div>
              <div className={styles["add__central_bank_row"]}>
                <div className={styles["add__central_bank_group"]}>
                  <p>Bank Email ID</p>
                  <input
                    type="email"
                    name="email_address"
                    onChange={inputChange}
                    value={createBankForm.email_address}
                  />
                </div>
                <div className={styles["add__central_bank_group"]}>
                  <p>Create a password</p>
                  <input
                    type="password"
                    name="password"
                    onChange={inputChange}
                    value={createBankForm.password}
                  />
                </div>
              </div>
            </form>
            <div className={styles["add__central_bank_button_group"]}>
              <button
                className={styles["add__central_bank_button"]}
                onClick={() => props.handleSubmit(createBankForm)}
              >
                Add Central Bank
              </button>
              <button
                className={styles["add__central_bank_button_cancel"]}
                onClick={props.handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
