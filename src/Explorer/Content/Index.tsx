import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightCircle,
  Coins,
  ExternalLink,
  FileText,
  List,
  MoveRight,
  Search,
} from "lucide-react";

import GeneralCard from "../../components/Cards/GeneralCard";
import { transactionController } from "../Controller/transaction.controller";
import { ITransaction } from "../Models/ITransaction";

import styles from "../styles/index.module.css";

export default function IndexLayout() {
  const [transactionData, setTransactionData] = useState<ITransaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    transactionController.getAllTransaction().then((data) => {
      setTransactionData(data);
    });
  }, []);

  return (
    <div className={styles["index__container"]}>
      <div className={styles["index__body"]}>
        <div className={styles["index__marker"]}>
          <div className={styles["flex"]}>
            <div className={styles["flex__start"]}>
              <div className={styles["search__bar"]}>
                <input
                  className={styles["search_input"]}
                  placeholder="Search by Address / Txn Hash"
                />
                <div className={styles["search__icon"]}>
                  <Search color="white" size={20} strokeWidth="1.5px" />
                </div>
              </div>
            </div>
            <div className={styles["flex__end"]}>
              <GeneralCard
                title="Token Supplies"
                subtitle="10,000 supplies"
                needAlignment={false}
                icon={<Coins color="white" size={30} strokeWidth="1.5px" />}
                children={<div></div>}
              />
              <GeneralCard
                title="Total Transactions"
                subtitle="10,000 transactions"
                needAlignment={false}
                icon={<List color="white" size={30} strokeWidth="1.5px" />}
                children={<div></div>}
              />
            </div>
          </div>
        </div>
        <div className={styles["index__background"]}>
          <div className={styles["transaction__details"]}>
            <div className={styles["transaction__heading"]}>
              <p>Latest Transaction</p>
              <ExternalLink color="white" className={styles["icon"]} />
            </div>
            <div className={styles["transaction__body"]}>
              {transactionData.slice(0, 7).map((transaction, index) => {
                let date = new Date(transaction.time_stamp);
                let localDate = date.getHours();
                return (
                  <div
                    className={styles["transaction__box"]}
                    key={index}
                    style={{
                      borderBottom:
                        index < transactionData.slice(0, 7).length - 1
                          ? "1px solid var(--explorer-border-color)"
                          : "none",
                    }}
                  >
                    <div className={styles["table__content"]}>
                      <div className={styles["hash__icon"]}>
                        <FileText color="white" strokeWidth="1px" />
                      </div>
                      <div className={styles["hash__data"]}>
                        <Link
                          className={styles["a"]}
                          to={"/address/" + transaction.txn_hash}
                        >
                          {transaction.txn_hash.substring(
                            0,
                            transaction.txn_hash.length - 30
                          )}
                          ...
                        </Link>
                        <p>{localDate} secs</p>
                      </div>
                    </div>
                    <div className={styles["table__content_v1"]}>
                      <p>
                        <span>From: </span>
                        {transaction.from.substring(0, 20)}...
                      </p>
                      <ArrowRightCircle
                        color="grey"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div className={styles["table__content_v1"]}>
                      <p>
                        <span>To: </span>
                        {transaction.to.substring(0, 20)}...
                      </p>
                      <ArrowRightCircle
                        color="grey"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div className={styles["table__content_v2"]}>
                      <div className={styles["method"]}>
                        {transaction.method}
                      </div>
                    </div>
                    <div className={styles["table__content_v2"]}>
                      <div className={styles["method"]}>
                        {transaction.fee_involved}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link to="transactions" className={styles["transaction__footer"]}>
              <p>View All Transaction</p>
              <MoveRight color="white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
