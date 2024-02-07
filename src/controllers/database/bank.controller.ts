import {
  getDocs,
  addDoc,
  bankRef,
  stableCoinRef,
} from "../../helpers/Config";
import { IBankDatabaseDetails } from "../../models/IBankDetails";
import { IStableCoins } from "../../models/IStableCoins";

class BankDatabaseController {
  async getAllBanks(): Promise<IBankDatabaseDetails[]> {
    try {
      let bankDatabase: IBankDatabaseDetails[] = [];
      const documentRequest = await getDocs(bankRef);
      for (let index = 0; index < documentRequest.docs.length; index++) {
        const element = documentRequest.docs[index];
        let data: IBankDatabaseDetails = {
          smart_contract_address: element.data().smart_contract_address,
          creator: element.data().creator,
          created_at: element.data().created_at,
          updated_at: element.data().updated_at,
          bank_details: element.data().bank_details,
        };
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

  async createStableCoin(coinDetails: IStableCoins): Promise<boolean> {
    try {
      const documentResponse = await addDoc(stableCoinRef, coinDetails);
      if (documentResponse) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async getAllStableCoins(): Promise<IStableCoins[]> {
    try {
      let data: IStableCoins[] = [];
      const documentResponse = await getDocs(stableCoinRef);
      for (let index = 0; index < documentResponse.docs.length; index++) {
        const element = documentResponse.docs[index];
        const elementData = element.data();
        const value:IStableCoins = {
          creator_id: elementData.creator_id,
          creator_smart_contract_address: elementData.creator_smart_contract_address,
          receiver_smart_contract_address: elementData.receiver_smart_contract_address,
          creator_wallet_address: elementData.creator_wallet_address,
          country: elementData.country,
          bank_id: elementData.bank_id,
          supply_minted: elementData.supply_minted,
          bank_details: elementData.bank_details,
          created_at: elementData.created_at,
          updated_at: elementData.updated_at,
        }
        data.push(value);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}
export const bankDatabaseController = new BankDatabaseController();
