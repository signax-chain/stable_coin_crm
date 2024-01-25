import { transactionData } from "../JsonData";
import { ITransaction } from "../Models/ITransaction";

class TransactionController {
  async getAllTransaction(): Promise<ITransaction[]> {
    let allTransaction: ITransaction[] = [];
    for (let index = 0; index < transactionData.length; index++) {
      const element = transactionData[index];
      let data: ITransaction = {
        txn_hash: element.txn_hash,
        from: element.from,
        to: element.to,
        method: element.method,
        time_stamp: element.time_stamp,
        fee_involved: element.fee_involved,
      };
      allTransaction.push(data);
    }
    return allTransaction;
  }
}
export const transactionController = new TransactionController();
