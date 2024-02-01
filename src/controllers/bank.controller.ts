import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CBDCContract from "../artifacts/contracts/cbdccoin.sol/CBDCCoin.json";
import { CONTRACT_ADDRESS, RPC_URL } from "../helpers/Constants";
import { IBankDetails, ICentralBankDetails } from "../models/IBankDetails";
import { IUserBankRelation, IWalletData } from "../models/IGeneralFormData";
import { localStorageController } from "./storage.controller";

class BankController {
  async getAllBanks(): Promise<IBankDetails[]> {
    try {
      const address = localStorageController.getData("wallet");
      if (!address) {
        return [];
      }
      const allToken: IBankDetails[] = [];
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CBDCContract.abi,
        provider
      );

      const walletData: IWalletData = JSON.parse(address);
      const data = await contract.getAllBanks(walletData!.data.address, {
        sender: walletData!.data.address,
      });
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let d: IBankDetails = {
          token_id: element.bank_id,
          bank_name: element.name,
          bank_user_extension: element.extension,
          bank_address: element.bank_address,
          daily_max_transaction_amount: 0,
          daily_max_number_transaction: 0,
          supply: 0,
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

  async getBalanceOf(
    bank_address: string,
    contract_address: string
  ): Promise<number> {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(
        contract_address,
        CBDCContract.abi,
        signer
      );
      let data = await contract.getBalanceOf(bank_address);
      return Number(data);
    } catch (error) {
      throw error;
    }
  }

  async getAllCentralBankData(
    contract_address: string
  ): Promise<ICentralBankDetails[]> {
    try {
      let allCentralBank: ICentralBankDetails[] = [];
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(
        contract_address,
        CBDCContract.abi,
        signer
      );
      let data = await contract.getAllCentralBankData();
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let centralBank: ICentralBankDetails = {
          smart_contract_address: element[0],
          bank_user_address: element[1],
          token_name: element[3],
          token_supply: element[2],
          token_symbol: element[4],
        };
        allCentralBank.push(centralBank);
      }
      return allCentralBank;
    } catch (error) {
      throw error;
    }
  }
}
export const bankController = new BankController();
