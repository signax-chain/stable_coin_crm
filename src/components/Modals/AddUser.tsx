import React, { ChangeEvent, useState } from "react";
import { IUserBankRelation } from "../../models/IGeneralFormData";
import { IBankDetails } from "../../models/IBankDetails";
import { Dialog } from "@mui/material";
import styles from "../../styles/modals/add_user.module.css";
import { XCircle } from "lucide-react";

export default function AddUser(props: {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (e: IUserBankRelation) => void;
  bank_information: IBankDetails;
}) {
  const [formInput, setFormInput] = useState<IUserBankRelation>({
    user_address: "",
    bank_address: props.bank_information.bank_address,
    name: "",
    bank_id_extension: "",
    id: 0,
  });

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  return (
    <div>
      <Dialog open={props.isOpen} onClose={props.handleClose} maxWidth="md">
        <div className={styles["add__user_modal"]}>
          <div className={styles["add__user_heading"]}>
            <h3>Add a new user to {props.bank_information.bank_name}</h3>
            <XCircle
              onClick={props.handleClose}
              size={30}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={styles["add__user_details"]}>
            <form className={styles["add__user_form"]}>
              <div className={styles["add__user_row"]}>
                <div className={styles["add__user_group"]}>
                  <p>Full Name</p>
                  <input
                    name="name"
                    type="text"
                    value={formInput.name}
                    onChange={inputChange}
                  />
                </div>
                <div className={styles["add__user_group"]}>
                  <p>User Wallet Address</p>
                  <input
                    name="user_address"
                    type="text"
                    value={formInput.user_address}
                    onChange={inputChange}
                  />
                </div>
              </div>
              <div className={styles["add__user_row"]}>
                <div className={styles["add__user_group"]}>
                  <p>Create Username</p>
                  <input
                    name="bank_id_extension"
                    type="text"
                    value={formInput.bank_id_extension}
                    onChange={(e) => {
                      const { value, name } = e.target;
                      setFormInput({
                        ...formInput,
                        [name]: value.replace(" ", "_"),
                      });
                    }}
                  />
                  <span>
                    You have created <strong>{formInput.bank_id_extension}
                    {props.bank_information.bank_user_extension}</strong>
                  </span>
                </div>
                <div className={styles["add__user_group"]}>
                  <p>Bank Wallet Address</p>
                  <input
                    name="bank_address"
                    type="text"
                    value={formInput.bank_address}
                    onChange={inputChange}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </form>
          </div>
          <div className={styles["add__user_button_group"]}>
            <button
              className={styles["add__user_button"]}
              onClick={() => props.handleSubmit(formInput)}
            >
              Add User
            </button>
            <button
              className={styles["add__user_button_cancel"]}
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
