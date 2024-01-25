import React from "react";

import styles from "../styles/all_transaction.module.css";
import { transactionData } from "../JsonData";
import { ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AllTransactions() {
  return (
    <div className={styles["all__transaction_container"]}>
      <div className={styles["transaction__content"]}>
        <div className={styles["all__transaction_heading"]}>
          <h3>All Transactions</h3>
          <div className={styles["divider"]}></div>
        </div>
        <div className={styles["all__transaction_data"]}>
          <div className={styles["transaction__table_heading"]}>
            <div className={styles["heading"]}>
              <h3>
                There are total of <span>{transactionData.length}</span>{" "}
                transactions
              </h3>
            </div>
          </div>
          <div className={styles["transaction__table_content"]}>
            <table className={styles["transaction__table"]}>
              <thead>
                <tr className={styles["table__row"]}>
                  <th className={styles["table__heading"]}>Txn Hash</th>
                  <th className={styles["table__heading"]}>Method</th>
                  <th className={styles["table__heading"]}>Timestamp</th>
                  <th className={styles["table__heading"]}>From</th>
                  <th className={styles["table__heading"]}>To</th>
                  <th className={styles["table__heading"]}>Total Fee</th>
                </tr>
              </thead>
              <tbody>
                {transactionData.map((transaction, index) => {
                  return (
                    <tr key={index}>
                      <td className={styles["table__data"]}>{transaction.txn_hash.substring(0, 30)}...</td>
                      <td className={styles["table__data"]}>
                        <div className={styles["method"]}>
                          {transaction.method}
                        </div>
                      </td>
                      <td className={styles["table__data"]}>{transaction.time_stamp}</td>
                      <td className={styles["table__data"]}>
                        <div className={styles["table__address"]}>
                          <p>{transaction.from.substring(0, 30)}...</p>
                          <Link to={"/explorer/address/" + transaction.from}>
                            <ArrowRightCircle
                              color="#3AA959"
                              style={{ cursor: "pointer" }}
                            />
                          </Link>
                        </div>
                      </td>
                      <td className={styles["table__data"]}>
                        <div className={styles["table__address"]}>
                          <p>{transaction.to.substring(0, 30)}...</p>
                          <Link to={"/explorer/address/" + transaction.to}>
                            {" "}
                            <ArrowRightCircle
                              color="#3AA959"
                              style={{ cursor: "pointer" }}
                            />
                          </Link>
                        </div>
                      </td>
                      <td className={styles["table__data"]}>{transaction.fee_involved}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className={styles["transaction__table_footer"]}></div>
        </div>
        <div className={styles["all__transaction_footer"]}></div>
      </div>
    </div>
  );
}
