import React, { useEffect, useState } from "react";

import styles from "../styles/all_transaction.module.css";
import { transactionData } from "../JsonData";
import { ArrowRightCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { transactionController } from "../../controllers/database/transaction.controller";
import { iTransactionDetails } from "../../models/ITransaction";
import moment from "moment";

export default function AllTransactions() {
  const params = useParams();
  const [transactionData, setTransactionData] = useState<iTransactionDetails[]>(
    []
  );
  useEffect(() => {
    let data = Object.keys(params).length;
    if (data > 1) {
      switch (params.type) {
        case "address":
          transactionController
            .getTransactionByAddress(params.id!)
            .then((data) => {
              setTransactionData(data);
            });
          break;
        default:
          break;
      }
    } else {
      transactionController.getAllTransaction().then((data) => {
        setTransactionData(data);
      });
    }
  }, []);

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
                  let date = new Date(transaction.created_at.toDate());
                  let localDate = moment(date).fromNow();
                  return (
                    <tr key={index}>
                      <td className={styles["table__data"]}>
                        <Link
                          className={styles["link"]}
                          to={"/explorer/txn/" + transaction.transaction_hash}
                        >
                          {transaction.transaction_hash.substring(0, 30)}...
                        </Link>
                      </td>
                      <td className={styles["table__data"]}>
                        <div className={styles["method"]}>
                          {transaction.transaction_action}
                        </div>
                      </td>
                      <td className={styles["table__data"]}>{localDate}</td>
                      <td className={styles["table__data"]}>
                        <div className={styles["table__address"]}>
                          <p>{transaction.from_address.substring(0, 30)}...</p>
                          <Link
                            className={styles["link"]}
                            to={"/explorer/address/" + transaction.from_address}
                          >
                            <ArrowRightCircle
                              color="#3AA959"
                              style={{ cursor: "pointer" }}
                            />
                          </Link>
                        </div>
                      </td>
                      <td className={styles["table__data"]}>
                        <div className={styles["table__address"]}>
                          <p>{transaction.to_address.substring(0, 30)}...</p>
                          <Link
                            to={"/explorer/address/" + transaction.to_address}
                          ></Link>
                        </div>
                      </td>
                      <td className={styles["table__data"]}>
                        {transaction.transaction_fee}
                      </td>
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
