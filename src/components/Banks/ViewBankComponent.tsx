import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "../../styles/view_bank.module.css";
import { IBankDetails } from "../../models/IBankDetails";
import { localStorageController } from "../../controllers/storage.controller";
import { Copy, Landmark, MoreVertical, User } from "lucide-react";
import GeneralCard from "../Cards/GeneralCard";
import AddUser from "../Modals/AddUser";
import { IUserBankRelation } from "../../models/IGeneralFormData";
import { bankController } from "../../controllers/bank.controller";

export default function ViewBankComponent() {
  const params = useParams();
  const [information, setInformation] = useState<IBankDetails>();
  const [allUsers, setAllUsers] = useState<IUserBankRelation[]>([]);
  const [createUserDialog, showCreateUserDialog] = useState(false);

  useEffect(() => {
    const id = params.id;
    const data = localStorageController.getBankStorage(id!);
    let bankData: IBankDetails = JSON.parse(data);
    setInformation(bankData);
    if (bankData) {
      bankController
        .getAllUsersFromBank(bankData.bank_address)
        .then((value) => {
          setAllUsers(value);
        });
    }
  }, []);

  const addUserToBank = async (user: IUserBankRelation) => {
    try {
      const res = await bankController.addUserAddressInfo(user);
      if (res) {
        alert("User Created Successfully ");
      } else {
        alert("User creation failed ");
      }
    } catch (error) {
      alert("Error adding user to bank " + error);
    }
  };

  return (
    <section className={styles["view__bank__section"]}>
      <div className={styles["view__bank_header"]}>
        <div className={styles["view__bank_header_1"]}>
          <h1 className={styles["view__bank_title"]}>View Bank Information</h1>
        </div>
        <button
          className={styles["user__bank_button"]}
          onClick={() => showCreateUserDialog(true)}
        >
          Add a User
        </button>
      </div>
      <div className={styles["view__bank_information"]}>
        <div className={styles["bank__stats"]}>
          <div className={styles["bank__details"]}>
            <div className={styles["bank__icon"]}>
              <Landmark size={40} strokeWidth="1.5px" color="white" />
            </div>
            <div className={styles["bank__info"]}>
              <h3>{information?.bank_name}</h3>
              <p>
                {information?.bank_address}{" "}
                <span>
                  <Copy
                    strokeWidth="2px"
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  />
                </span>
              </p>
            </div>
          </div>
          <div className={styles["divider"]}></div>
          <div className={styles["bank__stat"]}>
            <div className={styles["stat__Card"]}>
              <GeneralCard
                title="Total User"
                subtitle="100 Users"
                icon={<User size={30} color="white" />}
                children={<div></div>}
                needAlignment={false}
              />
            </div>
            <div className={styles["stat__Card"]}>
              <GeneralCard
                title="Total Tokens"
                subtitle="1000"
                icon={<User size={30} color="white" />}
                children={<div></div>}
                needAlignment={false}
              />
            </div>
          </div>
        </div>
        <div className={styles["bank__users"]}>
          <h3>All Available Users</h3>
          <div className={styles["all__bank_users"]}>
            {allUsers.length > 0 && (
              <div className={styles["bank__user_table"]}>
                <table className={styles["table"]}>
                  <thead>
                    <tr>
                      <th className={styles["heading"]}>Full Name</th>
                      <th className={styles["heading"]}>Wallet Address</th>
                      <th className={styles["heading"]}>Total Supply</th>
                      <th className={styles["heading"]}>User Name</th>
                      <th className={styles["heading"]}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user, index) => {
                      return (
                        <tr className={styles["table__border"]} key={index}>
                          <td>{user.name}</td>
                          <td>{user.user_address.substring(0, 20)}...</td>
                          <td>{0}</td>
                          <td>{user.bank_id_extension}</td>
                          <td style={{ textAlign: "right" }}>
                            <MoreVertical strokeWidth="1.6px" style={{cursor: "pointer"}} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {information && (
        <AddUser
          isOpen={createUserDialog}
          handleClose={() => showCreateUserDialog(false)}
          handleSubmit={(e: IUserBankRelation) => addUserToBank(e)}
          bank_information={information}
        />
      )}
    </section>
  );
}
