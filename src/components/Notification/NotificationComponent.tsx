import React, { useContext, useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { NotebookTabs } from "lucide-react";
import { toast } from "react-toastify";

import { INotificationUserDetails } from "../../models/INotifications";
import { notificationController } from "../../controllers/database/notification.controller";
import { authHelpers } from "../../helpers/AuthHelpers";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import { tokenController } from "../../controllers/token.controller";
import AccountContextProvider from "../../context/AccountContextProvider";
import { bankController } from "../../controllers/bank.controller";
import { localStorageController } from "../../controllers/storage.controller";
import { useRoleFinder } from "../../context/RoleContextProvider";
import { getAddressFromMessage } from "../../helpers/Regex";
import { userController } from "../../controllers/database/user.controller";
import { contractController } from "../../controllers/database/contract.controller";
import AddToken from "../Modals/AddToken";

import styles from "../../styles/notification.module.css";
import { ITokenDetails } from "../../models/ITokenDetail";
import { IContractDatabaseDetails } from "../../models/IContractDetails";
import { IStableCoins } from "../../models/IStableCoins";
export default function NotificationComponent(props: {
  notifications: INotificationUserDetails[];
}) {
  const [notifications, allNotifications] = useState<
    INotificationUserDetails[]
  >([]);
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );
  const { data } = useContext(AccountContextProvider);
  const { userInformation, role } = useRoleFinder();
  const [openCreateToken, setOpenCreateToken] = useState(false);
  const [stableCoin, setStableCoin] = useState<IStableCoins | undefined>(
    undefined
  );

  useEffect(() => {
    async function getAllNotifications() {
      changeLoaderText("Fetching Notifications");
      changeLoadingStatus(true);
      await getNotifications();
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    }
    getAllNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      let user_id = authHelpers.getUserID();
      let notification = await notificationController.getAllNotifications(
        user_id!,
        role!.role!
      );
      allNotifications(notification);
    } catch (error) {
      toast("Error Fetching Notifications " + error, {
        type: "error",
      });
    }
  };

  const sendRequestToken = async () => {
    try {
      changeLoaderText("Requesting Transfer....");
      changeLoadingStatus(true);
      const contract_address =
        localStorageController.getData("contract_address");
      const balance = await bankController.getBalanceOf(
        data.address,
        contract_address
      );
      const res = await tokenController.requestTokenTransfer({
        requesterAddress: data.address,
        tokens: balance,
      });
      if (res) {
        let notificationData: INotificationUserDetails = {
          creator_id: userInformation?.user_id!,
          receiver_id: "team",
          notification_doc_id: "",
          title: `${userInformation!.name} Requested for Stable Coin`,
          message: `${userInformation!.name} with address ${
            userInformation?.address
          } requested for ${balance} of Stable Coin. `,
          is_read: false,
          notification_type: "response_request_token",
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
          data: undefined,
        };
        const response =
          await notificationController.createNotificationWithUserData(
            notificationData
          );
        if (response) {
          toast("Request sent to CCX Team", {
            type: "success",
          });
        } else {
          toast("Request sending failed to CCX Team", {
            type: "error",
          });
        }
        setTimeout(() => {
          changeLoadingStatus(false);
        }, 3000);
      } else {
        toast("Request sending failed", {
          type: "error",
        });
        setTimeout(() => {
          changeLoadingStatus(false);
        }, 3000);
      }
    } catch (error) {
      toast("Sending Request failed with Error: " + error, {
        type: "error",
      });
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    }
  };

  const acceptRequestToken = async (str: string) => {
    try {
      let uid = await userController.getUserDetailsByAddress(str!);
      let contractAddressDoc = await contractController.getContractByBankId(
        uid
      );
      const res = await tokenController.approveTokenRequest({
        requesterAddress: str!,
        contractAddress: contractAddressDoc!.contract_address,
      });
      if (res) {
        toast("Request Accepted and transfered to " + str);
        setTimeout(() => {
          changeLoadingStatus(false);
        }, 3000);
      } else {
        toast("Request Accepting Failed " + str);
        setTimeout(() => {
          changeLoadingStatus(false);
        }, 3000);
      }
    } catch (error) {
      toast("Error Accepting Token " + error, {
        type: "error",
      });
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    }
  };

  const createToken = async (tokenData: ITokenDetails) => {
    try {
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address) {
        toast("No contract Initialization Found!!", {
          type: "error",
        });
      }
      changeLoaderText("Transfering required CBDC's");
      changeLoadingStatus(true);
      const res = await tokenController.createToken(
        tokenData,
        contract_address,
        data.address
      );
      if (res) {
        // const response: IContractDatabaseDetails = {
        //   contract_address: contract_address,
        //   user_id: userInformation?.user_id!,
        //   token_details: tokenData,
        //   created_at: new Date(),
        //   updated_at: new Date(),
        //   country: "",
        // };
        // await contractController.createUserContractCollection(response);
        const response: IContractDatabaseDetails | undefined =
          await contractController.getContractByBankId(stableCoin?.bank_id!);
        await acceptRequestToken(response!.contract_address);
        setOpenCreateToken(false);
        toast("Token transfered successfully", {
          type: "success",
        });
        setTimeout(() => {
          changeLoadingStatus(false);
          window.location.reload();
        }, 3000);
      } else {
        toast("Token creation failed", {
          type: "error",
        });
        setTimeout(() => {
          changeLoadingStatus(false);
        }, 3000);
      }
    } catch (error) {
      changeLoadingStatus(false);
      toast("Token creation failed " + error, {
        type: "error",
      });
    }
  };

  return (
    <div className={styles["notification__container"]}>
      <div className={styles["notification__container_heading"]}>
        <h1 className={styles["notification__title"]}>Notifications</h1>
      </div>
      <div className={styles["notification__body"]}>
        {notifications!.map((notification, index) => {
          return (
            <div className={styles["notification__card_container"]} key={index}>
              <div className={styles["notification__card"]}>
                <div
                  className={styles["notification__icon"]}
                  style={{
                    backgroundColor: !notification.is_read
                      ? "var(--primary-color)"
                      : "var(--primary-text-color)",
                  }}
                >
                  <NotebookTabs color="white" />
                </div>
                <div className={styles["notification__label"]}>
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span>{`${notification.created_at.toDate()}`}</span>
                </div>
                {!notification.is_read &&
                notification.notification_type === "request_token" ? (
                  <div className={styles["notification__button_group"]}>
                    <button
                      onClick={() => {
                        setOpenCreateToken(true);
                        if ("supply_minted" in notification.data!) {
                          setStableCoin(notification.data);
                        }
                      }}
                    >
                      Share{" "}
                      {"supply_minted" in notification.data!
                        ? notification.data.supply_minted
                        : 0}{" "}
                      CBDC
                    </button>
                  </div>
                ) : notification.notification_type ===
                  "response_request_token" ? (
                  <div className={styles["notification__button_group"]}>
                    <button
                      onClick={() => acceptRequestToken(notification.message)}
                    >
                      Transfer Stable Coin
                    </button>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div></div>
            </div>
          );
        })}
      </div>
      {stableCoin && (
        <AddToken
          isOpen={openCreateToken}
          handleClose={() => setOpenCreateToken(false)}
          handleSubmit={(e) => createToken(e)}
          mintedCoin={stableCoin}
        />
      )}
    </div>
  );
}
