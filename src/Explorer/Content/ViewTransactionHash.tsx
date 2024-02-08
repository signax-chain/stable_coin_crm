import React, { useContext, useEffect, useState } from "react";

import styles from "../styles/view_transaction.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { transactionController } from "../../controllers/database/transaction.controller";
import { iTransactionDetails } from "../../models/ITransaction";
import LoaderContextProvider from "../../context/LoaderContextProvider";
import {
  ArrowLeftCircle,
  Box,
  Check,
  CheckCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ethers } from "ethers";

export default function ViewTransactionHash() {
  const params = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<
    iTransactionDetails | undefined
  >(undefined);
  const { changeLoaderText, changeLoadingStatus } = useContext(
    LoaderContextProvider
  );

  useEffect(() => {
    async function getTransactionByHash() {
      if (params) {
        let id = params.id;
        await getTransaction(id!);
      }
    }
    getTransactionByHash();
  }, []);

  const getTransaction = async (id: string) => {
    try {
      changeLoaderText("Fetching Details ....");
      changeLoadingStatus(true);
      let queryData = await transactionController.getTransactionByHash(id);
      if (queryData.length > 0) {
        setTransaction(queryData[0]);
      }
      setTimeout(() => {
        changeLoadingStatus(false);
      }, 3000);
    } catch (error) {
      toast("Error finding transaction " + error, {
        type: "error",
        theme: "dark",
      });
    }
  };

  return (
    <section className={styles["view__transaction_section"]}>
      <div className={styles["view__transaction_content"]}>
        <div className={styles["view__transaction_heading"]}>
          <div className={styles["view__txn_heading"]}>
            <ArrowLeftCircle style={{ cursor: "pointer" }} onClick={()=>navigate("/explorer/")}/>
            <h3>Transaction Details</h3>
          </div>
          <div className={styles["divider"]}></div>
        </div>
        <div className={styles["view__transaction_body"]}>
          <div className={styles["view__transaction_details"]}>
            <div className={styles["view__transaction_info"]}>
              <div className={styles["view__transaction_table_heading"]}>
                Details of the transactions
              </div>
              {transaction !== undefined && (
                <table className={styles["view__details"]}>
                  <tbody>
                    <tr>
                      <td className={styles["heading"]}>Transaction Hash:</td>
                      <td className={styles["heading_value"]}>
                        {transaction?.transaction_hash}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles["heading"]}>Status:</td>
                      <td className={styles["heading_value"]}>
                        {transaction?.transaction_status === "success" ? (
                          <div className={styles["box__container"]}>
                            <CheckCircle2
                              color="#3AA959"
                              strokeWidth="1.2px"
                              fill="#3AA959"
                              fillOpacity={0.4}
                            />
                            <span>{transaction?.transaction_status}</span>
                          </div>
                        ) : (
                          <div className={styles["box__container_error"]}>
                            <XCircle
                              color="red"
                              strokeWidth="1.2px"
                              fill="red"
                              fillOpacity={0.4}
                            />
                            <span>{transaction?.transaction_status}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles["heading"]}>Block:</td>
                      <td className={styles["heading_value"]}>
                        <div className={styles["box"]}>
                          <Box strokeWidth="1.2px" />
                          <Link to={"block/" + transaction?.transaction_block}>
                            <span>{transaction?.transaction_block}</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles["heading"]}>Timestamp:</td>
                      <td
                        className={styles["heading_value"]}
                      >{`${transaction?.created_at.toDate()}`}</td>
                    </tr>
                    <tr>
                      <td className={styles["heading"]}>From:</td>
                      <td className={styles["heading_value"]}>
                        <Link
                          to={"/explorer/transactions/address/" + transaction?.from_address}
                        >{`${transaction?.from_address}`}</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles["heading"]}>To:</td>
                      <td className={styles["heading_value"]}>
                        <Link
                          to={"/explorer/transactions/address/" + transaction?.to_address}
                        >{`${transaction?.to_address}`}</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles["heading"]}>Value:</td>
                      <td className={styles["heading_value"]}>
                        {`${transaction?.transaction_value}`} ETH $(0.00)
                      </td>
                    </tr>
                    <tr>
                      <td className={styles["heading"]}>Gas Price:</td>
                      <td className={styles["heading_value"]}>
                        {`${ethers.formatUnits(
                          BigInt(transaction?.transaction_fee!),
                          "gwei"
                        )}`}{" "}
                        Gwei{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
