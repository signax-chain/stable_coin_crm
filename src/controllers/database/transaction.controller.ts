import { iTransaction, iTransactionDetails } from "../../models/ITransaction";
import { Timestamp, getDoc } from "firebase/firestore";
import {
  getDocs,
  transactionRef,
  addDoc,
  transactionDetailsRef,
  query,
  where,
  doc,
  orderBy,
  or,
} from "../../helpers/Config";

class TransactionController {
  async createTransaction(
    baseTransaction: iTransaction,
    details: iTransactionDetails
  ): Promise<boolean> {
    try {
      let documentResponse = await addDoc(transactionRef, baseTransaction);
      if (documentResponse) {
        let doc_id = documentResponse.id;
        details.doc_id = doc_id;
        let documentTransactionResponse = await addDoc(
          transactionDetailsRef,
          details
        );
        if (documentTransactionResponse) {
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async getAllTransaction(): Promise<iTransactionDetails[]> {
    try {
      let allTransactions: iTransactionDetails[] = [];
      let orderByDocument = orderBy("created_at", "desc");
      let queryDocument = query(transactionDetailsRef, orderByDocument);
      let documentResponse = await getDocs(queryDocument);
      for (let index = 0; index < documentResponse.docs.length; index++) {
        const element = documentResponse.docs[index];
        const elementData = element.data();
        let data: iTransactionDetails = {
          doc_id: elementData.doc_id,
          transaction_hash: elementData.transaction_hash,
          from_address: elementData.from_address,
          to_address: elementData.to_address,
          transaction_tokens: elementData.transaction_tokens,
          transaction_action: elementData.transaction_action,
          transaction_block: elementData.transaction_block,
          transaction_value: elementData.transaction_value,
          transaction_fee: elementData.transaction_fee,
          transaction_status: elementData.transaction_status,
          created_at: elementData.created_at,
        };
        allTransactions.push(data);
      }
      return allTransactions;
    } catch (error) {
      throw error;
    }
  }

  async getBaseTransaction(): Promise<iTransaction[]> {
    try {
      let allBaseTransactions: iTransaction[] = [];
      let documentResponse = await getDocs(transactionRef);
      for (let index = 0; index < documentResponse.docs.length; index++) {
        const element = documentResponse.docs[index];
        const elementData = element.data();
        let data: iTransaction = {
          transaction_hash: elementData.transaction_hash,
          from_address: elementData.from_address,
          to_address: elementData.to_address,
          created_at: elementData.created_at,
        };
        allBaseTransactions.push(data);
      }
      return allBaseTransactions;
    } catch (error) {
      throw error;
    }
  }

  async getTransactionByHash(hash: string): Promise<iTransactionDetails[]> {
    try {
      let data: iTransactionDetails[] = [];
      const documentWhere = where("transaction_hash", "==", hash);
      const documentQuery = query(transactionDetailsRef, documentWhere);
      const documentResponse = getDocs(documentQuery);
      for (
        let index = 0;
        index < (await documentResponse).docs.length;
        index++
      ) {
        const element = (await documentResponse).docs[index];
        const elementData = element.data();
        let queryData: iTransactionDetails = {
          doc_id: elementData.doc_id,
          transaction_hash: elementData.transaction_hash,
          from_address: elementData.from_address,
          to_address: elementData.to_address,
          transaction_tokens: elementData.transaction_tokens,
          transaction_action: elementData.transaction_action,
          transaction_block: elementData.transaction_block,
          transaction_value: elementData.transaction_value,
          transaction_fee: elementData.transaction_fee,
          transaction_status: elementData.transaction_status,
          created_at: elementData.created_at,
        };
        data.push(queryData);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTransactionByAddress(hash: string): Promise<iTransactionDetails[]> {
    try {
      let data: iTransactionDetails[] = [];
      const documentWhere = where("from_address", "==", hash);
      const documentQuery = query(
        transactionDetailsRef,
        or(documentWhere, where("to_address", "==", hash))
      );
      const documentResponse = getDocs(documentQuery);
      for (
        let index = 0;
        index < (await documentResponse).docs.length;
        index++
      ) {
        const element = (await documentResponse).docs[index];
        const elementData = element.data();
        let queryData: iTransactionDetails = {
          doc_id: elementData.doc_id,
          transaction_hash: elementData.transaction_hash,
          from_address: elementData.from_address,
          to_address: elementData.to_address,
          transaction_tokens: elementData.transaction_tokens,
          transaction_action: elementData.transaction_action,
          transaction_block: elementData.transaction_block,
          transaction_value: elementData.transaction_value,
          transaction_fee: elementData.transaction_fee,
          transaction_status: elementData.transaction_status,
          created_at: elementData.created_at,
        };
        data.push(queryData);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}
export const transactionController = new TransactionController();
