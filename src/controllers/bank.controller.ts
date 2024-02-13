import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CBDCContract from "../artifacts/contracts/cbdccoin.sol/CBDCCoin.json";
import StableContract from "../artifacts/contracts/stablecoin.sol/StableCoin.json";
import { RPC_URL } from "../helpers/Constants";
import {  STABLE_COIN_CONTRACT_ADDRESS } from "../helpers/ContractAddress";
import {
  IBankDetails,
  ICentralBankDetails,
  ICentralBankFormDetails,
} from "../models/IBankDetails";
import { IUserBankRelation, IWalletData } from "../models/IGeneralFormData";
import { localStorageController } from "./storage.controller";
import { iTransaction, iTransactionDetails } from "../models/ITransaction";
import { Timestamp } from "firebase/firestore";
import { transactionController } from "./database/transaction.controller";

class BankController {
  async getAllBanks(
    contractAddress: string | undefined
  ): Promise<IBankDetails[]> {
    try {
      const address = localStorageController.getData("wallet");
      const contract_address =
        localStorageController.getData("contract_address");
      if (!address || !contract_address || !contractAddress) {
        return [];
      }
      const allToken: IBankDetails[] = [];
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        contract_address ? contract_address : contractAddress!,
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
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address) {
        return false;
      }
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
        contract_address,
        CBDCContract.abi,
        signer
      );
      let transaction = await contract.addBank(bank.bank_address, data);
      const transactionData = await transaction.wait();
      if (transactionData) {
        
        let baseTransaction: iTransaction = {
          transaction_hash: transactionData.blockHash,
          from_address: transactionData.from,
          to_address: transactionData.to,
          created_at: Timestamp.now(),
        };
        let extraDetails: iTransactionDetails = {
          doc_id: "",
          transaction_hash: transactionData.blockHash,
          from_address: transactionData.from,
          to_address: transactionData.to,
          transaction_tokens: [],
          transaction_action: "create_bank",
          transaction_block: transactionData.blockNumber,
          transaction_value: 0,
          transaction_fee: Number(transactionData.gasUsed),
          transaction_status: "success",
          created_at: Timestamp.now(),
        };
        await transactionController.createTransaction(
          baseTransaction,
          extraDetails
        );
        return true;
      }
      
      let baseTransaction: iTransaction = {
        transaction_hash: transactionData.blockHash,
        from_address: transactionData.from,
        to_address: transactionData.to,
        created_at: Timestamp.now(),
      };
      let extraDetails: iTransactionDetails = {
        doc_id: "",
        transaction_hash: transactionData.blockHash,
        from_address: transactionData.from,
        to_address: transactionData.to,
        transaction_tokens: [],
        transaction_action: "create_bank",
        transaction_block: transactionData.blockNumber,
        transaction_value: 0,
        transaction_fee: Number(transactionData.gasUsed),
        transaction_status: "error",
        created_at: Timestamp.now(),
      };
      await transactionController.createTransaction(
        baseTransaction,
        extraDetails
      );
      return false;
    } catch (error) {
      throw error;
    }
  }

  async addUserAddressInfo(user: IUserBankRelation) {
    try {
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address) {
        return false;
      }
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(
        contract_address,
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
        
        let baseTransaction: iTransaction = {
          transaction_hash: transactionData.blockHash,
          from_address: transactionData.from,
          to_address: transactionData.to,
          created_at: Timestamp.now(),
        };
        let extraDetails: iTransactionDetails = {
          doc_id: "",
          transaction_hash: transactionData.blockHash,
          from_address: transactionData.from,
          to_address: transactionData.to,
          transaction_tokens: [],
          transaction_action: "add_user_address_info",
          transaction_block: transactionData.blockNumber,
          transaction_value: 0,
          transaction_fee: Number(transactionData.gasUsed),
          transaction_status: "success",
          created_at: Timestamp.now(),
        };
        await transactionController.createTransaction(
          baseTransaction,
          extraDetails
        );
        return true;
      }
      
      let baseTransaction: iTransaction = {
        transaction_hash: transactionData.blockHash,
        from_address: transactionData.from,
        to_address: transactionData.to,
        created_at: Timestamp.now(),
      };
      let extraDetails: iTransactionDetails = {
        doc_id: "",
        transaction_hash: transactionData.blockHash,
        from_address: transactionData.from,
        to_address: transactionData.to,
        transaction_tokens: [],
        transaction_action: "add_user_address_info",
        transaction_block: transactionData.blockNumber,
        transaction_value: 0,
        transaction_fee: Number(transactionData.gasUsed),
        transaction_status: "error",
        created_at: Timestamp.now(),
      };
      await transactionController.createTransaction(
        baseTransaction,
        extraDetails
      );
      return false;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsersFromBank(
    bank_address: string
  ): Promise<IUserBankRelation[]> {
    try {
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address) {
        return [];
      }
      const allUsers: IUserBankRelation[] = [];
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        contract_address,
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
    contractAddress: string | undefined
  ): Promise<number> {
    try {
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address && contractAddress === undefined) {
        return 0;
      }
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(
        contract_address ? contract_address : contractAddress!,
        CBDCContract.abi,
        signer
      );
      let data = await contract.getBalanceOf(bank_address);
      return Number(data);
    } catch (error) {
      throw error;
    }
  }

  async getAllCentralBankData(): Promise<ICentralBankDetails[]> {
    try {
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address) {
        return [];
      }
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

  // stable coin
  async requestToken(address: string, _tokens: number): Promise<boolean> {
    try {
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address) {
        return false;
      }
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        contract_address,
        CBDCContract.abi,
        provider
      );
      const transaction = await contract.requestTokens(address, _tokens);
      const transactionData = await transaction.wait();
      if (transactionData) {
        let account = await provider.getSigner();
        let baseTransaction: iTransaction = {
          transaction_hash: transactionData.blockHash,
          from_address: account.address,
          to_address: transactionData.to,
          created_at: Timestamp.now(),
        };
        let extraDetails: iTransactionDetails = {
          doc_id: "",
          transaction_hash: transactionData.blockHash,
          from_address: account.address,
          to_address: transactionData.to,
          transaction_tokens: [],
          transaction_action: "request_token",
          transaction_block: transactionData.blockNumber,
          transaction_value: 0,
          transaction_fee: Number(transactionData.gasUsed),
          transaction_status: "success",
          created_at: Timestamp.now(),
        };
        await transactionController.createTransaction(
          baseTransaction,
          extraDetails
        );
        return true;
      }
      let account = await provider.getSigner();
      let baseTransaction: iTransaction = {
        transaction_hash: transactionData.blockHash,
        from_address: account.address,
        to_address: transactionData.to,
        created_at: Timestamp.now(),
      };
      let extraDetails: iTransactionDetails = {
        doc_id: "",
        transaction_hash: transactionData.blockHash,
        from_address: account.address,
        to_address: transactionData.to,
        transaction_tokens: [],
        transaction_action: "request_token",
        transaction_block: transactionData.blockNumber,
        transaction_value: 0,
        transaction_fee: Number(transactionData.gasUsed),
        transaction_status: "error",
        created_at: Timestamp.now(),
      };
      await transactionController.createTransaction(
        baseTransaction,
        extraDetails
      );
      return false;
    } catch (error) {
      throw error;
    }
  }

  async approveRequestToken(address: string): Promise<boolean> {
    try {
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address) {
        return false;
      }
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        contract_address,
        CBDCContract.abi,
        provider
      );
      const transaction = await contract.approveTokens(address);
      const transactionData = await transaction.wait();
      if (transactionData) {
        let account = await provider.getSigner();
        let baseTransaction: iTransaction = {
          transaction_hash: transactionData.blockHash,
          from_address: account.address,
          to_address: address,
          created_at: Timestamp.now(),
        };
        let extraDetails: iTransactionDetails = {
          doc_id: "",
          transaction_hash: transactionData.blockHash,
          from_address: account.address,
          to_address: address,
          transaction_tokens: [],
          transaction_action: "approve_request_token",
          transaction_block: transactionData.blockNumber,
          transaction_value: 0,
          transaction_fee: Number(transactionData.gasUsed),
          transaction_status: "success",
          created_at: Timestamp.now(),
        };
        await transactionController.createTransaction(
          baseTransaction,
          extraDetails
        );
        return true;
      }
      let account = await provider.getSigner();
      let baseTransaction: iTransaction = {
        transaction_hash: transactionData.blockHash,
        from_address: account.address,
        to_address: address,
        created_at: Timestamp.now(),
      };
      let extraDetails: iTransactionDetails = {
        doc_id: "",
        transaction_hash: transactionData.blockHash,
        from_address: account.address,
        to_address: address,
        transaction_tokens: [],
        transaction_action: "approve_request_token",
        transaction_block: transactionData.blockNumber,
        transaction_value: 0,
        transaction_fee: Number(transactionData.gasUsed),
        transaction_status: "error",
        created_at: Timestamp.now(),
      };
      await transactionController.createTransaction(
        baseTransaction,
        extraDetails
      );
      return false;
    } catch (error) {
      throw error;
    }
  }

  async createACentralBank(bank: ICentralBankFormDetails): Promise<boolean> {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        STABLE_COIN_CONTRACT_ADDRESS,
        StableContract.abi,
        signer
      );
      const transaction = await contract.addCentralBank(
        bank.name,
        bank.symbol,
        bank.country,
        bank.contract_address
      );
      const transactionData = await transaction.wait();
      if (transactionData) {
        console.log(transactionData);
        
        let baseTransaction: iTransaction = {
          transaction_hash: transactionData.blockHash,
          from_address: transactionData.from,
          to_address: transactionData.to,
          created_at: Timestamp.now(),
        };
        let extraDetails: iTransactionDetails = {
          doc_id: "",
          transaction_hash: transactionData.blockHash,
          from_address: transactionData.from,
          to_address: transactionData.to,
          transaction_tokens: [],
          transaction_action: "create_central_bank",
          transaction_block: transactionData.blockNumber,
          transaction_value: 0,
          transaction_fee: Number(transactionData.gasUsed),
          transaction_status: "success",
          created_at: Timestamp.now(),
        };
        await transactionController.createTransaction(
          baseTransaction,
          extraDetails
        );
        return true;
      }
      
      let baseTransaction: iTransaction = {
        transaction_hash: transactionData.blockHash,
        from_address: transactionData.from,
        to_address: transactionData.to,
        created_at: Timestamp.now(),
      };
      let extraDetails: iTransactionDetails = {
        doc_id: "",
        transaction_hash: transactionData.blockHash,
        from_address: transactionData.from,
        to_address: transactionData.to,
        transaction_tokens: [],
        transaction_action: "create_central_bank",
        transaction_block: transactionData.blockNumber,
        transaction_value: 0,
        transaction_fee: Number(transactionData.gasUsed),
        transaction_status: "error",
        created_at: Timestamp.now(),
      };
      await transactionController.createTransaction(
        baseTransaction,
        extraDetails
      );
      return false;
    } catch (error) {
      throw error;
    }
  }
}
export const bankController = new BankController();
