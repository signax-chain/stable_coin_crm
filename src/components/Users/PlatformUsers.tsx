import React, { useEffect, useState } from "react";

import styles from "../../styles/platform-user.module.css";
import { IUserDetails } from "../../models/IUserDetails";
import { userController } from "../../controllers/database/user.controller";
import { useRoleFinder } from "../../context/RoleContextProvider";
import { MoreVertical } from "lucide-react";

export default function PlatformUsers() {
  const [allUsers, setAllUsers] = useState<IUserDetails[]>([]);
  const { userInformation } = useRoleFinder();
  useEffect(() => {
    async function getAllUser() {
      await getAllPlatformUsers();
    }
    getAllUser();
  }, []);

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

  return (
    <div className={styles["platform__user_content"]}>
      <div className={styles["platform__user_heading"]}>
        <h1 className={styles["platform__user_title"]}>All Platform Users</h1>
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
    </div>
  );
}
