import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CBDCContract from "../artifacts/contracts/cbdccoin.sol/CBDCCoin.json";
import { CONTRACT_ADDRESS, RPC_URL } from "../helpers/Constants";
import { IBankDetails } from "../models/IBankDetails";
import { IUserBankRelation } from "../models/IGeneralFormData";

class BankController {
  async getAllBanks() {
    try {
      const allToken = [];
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CBDCContract.abi,
        provider
      );
      const data = await contract.getAllBanks();
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let d = {
          bank_id: element.bank_id,
          name: element.name,
          extension: element.extension,
          bank_address: element.bank_address,
        };
        allToken.push(d);
      }
      return allToken;
    } catch (error) {
      throw error;
    }
  }

  async createBank(bank: IBankDetails) {
    try {
      let data = {
        name: bank.bank_name,
        bank_address: bank.bank_address,
        extension: bank.bank_user_extension,
        bank_id: bank.token_id,
      };
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CBDCContract.abi,
        signer
      );
      let transaction = await contract.addBank(bank.bank_address, data);
      const transactionData = await transaction.wait();
      if (transactionData) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async addUserAddressInfo(user: IUserBankRelation) {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CBDCContract.abi,
        signer
      );
      let transaction = await contract.addUserAddressInfo(
        user.user_address,
        user.bank_address,
        user.name,
        user.bank_id_extension
      );
      const transactionData = await transaction.wait();
      if (transactionData) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsersFromBank(
    bank_address: string
  ): Promise<IUserBankRelation[]> {
    try {
      const allUsers: IUserBankRelation[] = [];
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CBDCContract.abi,
        provider
      );
      const data = await contract.getAllUserFromBankAddress(bank_address);
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let d: IUserBankRelation = {
          bank_address: bank_address,
          user_address: element[0],
          name: element[2],
          bank_id_extension: element[3],
          id: element[4],
        };
        allUsers.push(d);
      }
      return allUsers;
    } catch (error) {
      throw error;
    }
  }
}
export const bankController = new BankController();
