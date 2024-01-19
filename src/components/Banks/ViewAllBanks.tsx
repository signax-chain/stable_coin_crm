import React, { ChangeEvent, useState } from "react";
import { Landmark } from "lucide-react";

import GeneralCard from "../Cards/GeneralCard";
import AddBankModal from "../Modals/AddBank";
import { IBankDetails } from "../../models/IBankDetails";

import styles from "../../styles/banks.module.css";

export default function ViewAllBankComponents() {
  const [bankData, setBankData] = useState([
    {
      title: "Commercial Bank One",
      subtitle: "Token Supply: 10,000",
      icon: <Landmark color="white" size={40} strokeWidth="1.5px" />,
    },
    {
      title: "Commercial Bank One",
      subtitle: "Token Supply: 10,000",
      icon: <Landmark color="white" size={40} strokeWidth="1.5px" />,
    },
    {
      title: "Commercial Bank One",
      subtitle: "Token Supply: 10,000",
      icon: <Landmark color="white" size={40} strokeWidth="1.5px" />,
    },
    {
      title: "Commercial Bank One",
      subtitle: "Token Supply: 10,000",
      icon: <Landmark color="white" size={40} strokeWidth="1.5px" />,
    },
    {
      title: "Commercial Bank One",
      subtitle: "Token Supply: 10,000",
      icon: <Landmark color="white" size={40} strokeWidth="1.5px" />,
    },
  ]);
  const [openCreateBank, setOpenCreateBank] = useState(false);
 


  return (
    <div className={styles["bank__container"]}>
      <div className={styles["bank__header"]}>
        <h1 className={styles["bank__title"]}>View All Banks</h1>
        <button
          className={styles["create__bank_button"]}
          onClick={() => setOpenCreateBank(true)}
        >
          Add a Bank
        </button>
      </div>
      <div className={styles["bank__list"]}>
        <div className={styles["bank__lists"]}>
          {bankData.map((bank, index) => {
            return (
              <div className={styles["bank__card"]}>
                <GeneralCard
                  key={index}
                  title={bank.title}
                  subtitle={bank.subtitle}
                  icon={bank.icon}
                  children={<div></div>}
                />
              </div>
            );
          })}
        </div>
      </div>
      {openCreateBank && (
        <AddBankModal
          isOpen={openCreateBank}
          handleSubmit={() => {}}
          handleClose={() => {
            setOpenCreateBank(false);
          }}
        />
      )}
    </div>
  );
}
