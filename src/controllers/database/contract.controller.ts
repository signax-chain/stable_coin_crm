import {
  getDoc,
  doc,
  setDoc,
  getDocs,
  contractRef,
} from "../../helpers/Config";
import { IContractDatabaseDetails } from "../../models/IContractDetails";

class ContractController {
  async getAllContractAddresses(): Promise<IContractDatabaseDetails[]> {
    try {
      let allUserContractRelations: IContractDatabaseDetails[] = [];
      let documentResponse = await getDocs(contractRef);
      for (let index = 0; index < documentResponse.docs.length; index++) {
        const element = documentResponse.docs[index];
        const elementData = element.data();
        let data: IContractDatabaseDetails = {
          contract_address: elementData.contract_address,
          user_id: elementData.user_id,
          token_details: {
            token_id: elementData.token_details.token_id,
            token_name: elementData.token_details.token_name,
            token_description: elementData.token_details.token_description,
            token_supply: elementData.token_details.token_supply,
          },
          created_at: new Date(),
          updated_at: new Date(),
        };
        allUserContractRelations.push(data);
      }
      return allUserContractRelations;
    } catch (error) {
      throw error;
    }
  }

  async getContractByBankId(uid: string): Promise<IContractDatabaseDetails> {
    try {
      let contractDatabaseDetails: IContractDatabaseDetails | undefined =
        undefined;
      const documentRequest = doc(contractRef, uid);
      const documentResponse = await getDoc(documentRequest);
      if (documentResponse.exists()) {
        let element = documentResponse.data();
        let data: IContractDatabaseDetails = {
          contract_address: element.contract_address,
          user_id: element.user_id,
          token_details: {
            token_id: element.token_details.token_id,
            token_name: element.token_details.token_name,
            token_description: element.token_details.token_description,
            token_supply: element.token_details.token_supply,
          },
          created_at: new Date(),
          updated_at: new Date(),
        };
        contractDatabaseDetails = data;
        return contractDatabaseDetails!;
      }
      throw "Following user do not have any tokens";
    } catch (error) {
      throw error;
    }
  }

  async createUserContractCollection(
    contractData: IContractDatabaseDetails
  ): Promise<boolean> {
    try {
      const documentRequest = doc(contractRef, contractData.user_id);
      await setDoc(documentRequest, contractData, {
        merge: true,
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  async updateUserContractCollection(docId: string, data:IContractDatabaseDetails):Promise<boolean>{
    try {
      let documentRequest = doc(contractRef, docId);
      await setDoc(documentRequest, data, {merge: true});
      return true;
    } catch (error) {
      throw error;
    }
  }

}
export const contractController = new ContractController();
