import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Copy, Landmark, MoreVertical, User } from "lucide-react";

import { IBankDetails } from "../../models/IBankDetails";
import { localStorageController } from "../../controllers/storage.controller";
import GeneralCard from "../Cards/GeneralCard";
import AddUser from "../Modals/AddUser";
import { IUserBankRelation } from "../../models/IGeneralFormData";
import { bankController } from "../../controllers/bank.controller";
import LoaderContextProvider from "../../context/LoaderContextProvider";

import styles from "../../styles/view_bank.module.css";
import { useTranslation } from "../../context/TranslatorContextProvider";

export default function ViewBankComponent() {
  const params = useParams();
  const { translate, language } = useTranslation();
  const [information, setInformation] = useState<IBankDetails>();
  const [allUsers, setAllUsers] = useState<IUserBankRelation[]>([]);
  const [createUserDialog, showCreateUserDialog] = useState(false);
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  const [dynamicTitles, setDynamicTitle] = useState({
    title_1: "View Bank Information",
    title_2: "Add a User",
    title_3: "Total User",
    title_4: "Total Tokens",
    title_5: "All Available Users",
  });

  useEffect(() => {
    changeLoaderText("Fetching All Users");
    changeLoadingStatus(true);
    const id = params.id;
    const data = localStorageController.getData(id!);
    let bankData: IBankDetails = JSON.parse(data);
    setInformation(bankData);
    if (bankData) {
      bankController
        .getAllUsersFromBank(bankData.bank_address)
        .then((value) => {
          setAllUsers(value);
          setTimeout(() => {
            changeLoadingStatus(false);
          }, 3000);
        });
    }
  }, []);

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const data = {
          title_1: await translate(dynamicTitles.title_1, language),
          title_2: await translate(dynamicTitles.title_2, language),
          title_3: await translate(dynamicTitles.title_3, language),
          title_4: await translate(dynamicTitles.title_4, language),
          title_5: await translate(dynamicTitles.title_5, language),
        };
        setDynamicTitle(data);
      } catch (error) {
        console.error("Error fetching translation:", error);
      }
    };
    fetchTranslation();
  }, [language]);

  const addUserToBank = async (user: IUserBankRelation) => {
    try {
      changeLoaderText("Add new User");
      changeLoadingStatus(true);
      const res = await bankController.addUserAddressInfo(user);
      if (res) {
        showCreateUserDialog(false);
        changeLoadingStatus(false);
        alert("User Created Successfully ");
      } else {
        changeLoadingStatus(false);
        alert("User creation failed ");
      }
    } catch (error) {
      changeLoadingStatus(false);
      alert("Error adding user to bank " + error);
    }
  };

  return (
    <section className={styles["view__bank__section"]}>
      <div className={styles["view__bank_header"]}>
        <div className={styles["view__bank_header_1"]}>
          <h1 className={styles["view__bank_title"]}>{dynamicTitles.title_1}</h1>
        </div>
        <button
          className={styles["user__bank_button"]}
          onClick={() => showCreateUserDialog(true)}
        >
          {dynamicTitles.title_2}
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
                title={dynamicTitles.title_3}
                subtitle={`${allUsers.length} Users`}
                icon={<User size={30} color="white" />}
                children={<div></div>}
                needAlignment={false}
              />
            </div>
            <div className={styles["stat__Card"]}>
              <GeneralCard
                title={dynamicTitles.title_4}
                subtitle={`${information?.supply} Tokens`}
                icon={<User size={30} color="white" />}
                children={<div></div>}
                needAlignment={false}
              />
            </div>
          </div>
        </div>
        <div className={styles["bank__users"]}>
          <h3>{dynamicTitles.title_5}</h3>
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
                            <MoreVertical
                              strokeWidth="1.6px"
                              style={{ cursor: "pointer" }}
                            />
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
