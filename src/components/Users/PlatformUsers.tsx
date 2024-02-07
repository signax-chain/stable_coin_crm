import React, { useContext, useEffect, useState } from "react";

import styles from "../../styles/platform-user.module.css";
import { IUserDetails } from "../../models/IUserDetails";
import { userController } from "../../controllers/database/user.controller";
import { useRoleFinder } from "../../context/RoleContextProvider";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import AddCentralBank from "../Modals/AddCentralBank";
import { ICentralBankFormDetails } from "../../models/IBankDetails";
import { bankController } from "../../controllers/bank.controller";
import { authController } from "../../controllers/database/auth.controller";
import { contractController } from "../../controllers/database/contract.controller";
import { IContractDatabaseDetails } from "../../models/IContractDetails";

export default function PlatformUsers() {
  const [allUsers, setAllUsers] = useState<IUserDetails[]>([]);
  const { userInformation } = useRoleFinder();
  useEffect(() => {
    async function getAllUser() {
      await getAllPlatformUsers();
    }
    getAllUser();
  }, []);
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  const [openCentralBankModal, setOpenCentralBankModal] = useState(false);

  const getAllPlatformUsers = async () => {
    try {
      const response = await userController.getAllUsers(
        userInformation?.user_id!
      );
      setAllUsers(response);
    } catch (error) {
      throw error;
    }
  };

  const addNewCentralBank = async (e: ICentralBankFormDetails) => {
    try {
      changeLoaderText("Adding New Bank");
      changeLoadingStatus(true);
      const res = await bankController.createACentralBank(e);
      if (res) {
        const userDetails: IUserDetails = {
          name: e.name,
          email: e.email_address,
          password: e.password,
          country: e.country,
          role: "central_bank",
          user_id: "",
          address: "",
          created_at: new Date(),
          updated_at: new Date(),
        };
        const response = await authController.registerUser(userDetails);
        if(response){
          const data:IContractDatabaseDetails = {
            contract_address: e.contract_address,
            user_id: response.user.uid,
            token_details: {
              token_id: 0,
              token_name: "",
              token_description: "",
              token_supply: 0
            },
            created_at: new Date(),
            updated_at: new Date(),
            country: "",
          }
          await contractController.createUserContractCollection(data);
          toast("New Bank Added Successfully ", {
            type: "success",
            theme: "dark",
          });
          setTimeout(() => {
            changeLoadingStatus(false);
          }, 3000);
        }
      } else {
        toast("Bank Adding failed", {
          type: "error",
          theme: "dark",
        });
        setTimeout(() => {
          changeLoadingStatus(false);
        }, 3000);
      }
    } catch (error) {
      toast("Adding New Central Bank Failed " + error, {
        type: "error",
        theme: "dark",
      });
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    }
  };

  return (
    <div className={styles["platform__user_content"]}>
      <div className={styles["platform__user_heading"]}>
        <h1 className={styles["platform__user_title"]}>All Platform Users</h1>
        <button
          className={styles["platform__user_add_button"]}
          onClick={() => setOpenCentralBankModal(true)}
        >
          Add New User
        </button>
      </div>
      <div className={styles["platform__user_list"]}>
        {allUsers.length === 0 ? (
          <div className="no__data_container">
            <h3>No Users Found!!</h3>
          </div>
        ) : (
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Wallet Address</th>
                <th>Country</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user, index) => {
                return (
                  <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address ? user.address : "----"}</td>
                    <td>{user.country}</td>
                    <td>{user.role}</td>
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
        )}
      </div>
      <AddCentralBank
        isOpen={openCentralBankModal}
        handleClose={() => setOpenCentralBankModal(false)}
        handleSubmit={(e) => addNewCentralBank(e)}
      />
    </div>
  );
}
