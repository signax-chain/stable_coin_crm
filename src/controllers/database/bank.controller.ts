import {
  getDoc,
  doc,
  setDoc,
  getDocs,
  contractRef,
  addDoc,
  bankRef,
} from "../../helpers/Config";
import { IBankDatabaseDetails } from "../../models/IBankDetails";
import { localStorageController } from "../storage.controller";

class BankDatabaseController {
  async getAllBanks(): Promise<IBankDatabaseDetails[]> {
    try {
      let bankDatabase: IBankDatabaseDetails[] = [];
      const documentRequest = await getDocs(bankRef);
      for (let index = 0; index < documentRequest.docs.length; index++) {
        const element = documentRequest.docs[index];
        let data:IBankDatabaseDetails = {
          smart_contract_address: element.data().smart_contract_address,
          creator: element.data().creator,
          created_at: element.data().created_at,
          updated_at: element.data().updated_at,
          bank_details: element.data().bank_details,
        }
        bankDatabase.push(data);
      }
      return bankDatabase;
    } catch (error) {
      throw error;
    }
  }
  async createBanks(bankDatabase: IBankDatabaseDetails): Promise<boolean> {
    try {
      let documentRequest = await addDoc(bankRef, bankDatabase);
      if (documentRequest) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}
export const bankDatabaseController = new BankDatabaseController();
