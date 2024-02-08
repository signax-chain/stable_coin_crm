import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CBDCContract from "../artifacts/contracts/cbdccoin.sol/CBDCCoin.json";
import StableContract from "../artifacts/contracts/stablecoin.sol/StableCoin.json";
import { ITokenDetails } from "../models/ITokenDetail";
import { RPC_URL, STABLE_COIN_CONTRACT_ADDRESS } from "../helpers/Constants";
import { ICentralBankDetails } from "../models/IBankDetails";
import { localStorageController } from "./storage.controller";
import { ITransferTokenFormData } from "../models/IGeneralFormData";
import { iTransaction, iTransactionDetails } from "../models/ITransaction";
import { Timestamp } from "firebase/firestore";
import { transactionController } from "./database/transaction.controller";

class TokenController {
  async getAllToken(address: string) {
    try {
      const contract_address =
        localStorageController.getData("contract_address");
      if (!contract_address) {
        return [];
      }
      const allToken = [];
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        contract_address,
        CBDCContract.abi,
        provider
      );
      const data = await contract.getAllToken(address);
      if (Number(data[0]) === 0) {
        return [];
      }
      let d = {
        token_id: data[0],
        name: data[1],
        supply: data[3],
        symbol: data[2],
      };
      allToken.push(d);
      return allToken;
    } catch (error) {
      throw error;
    }
  }

  async createToken(
    token: ITokenDetails,
    contract_address: string,
    bank_address: string
  ) {
    try {
      let data = {
        name: token.token_name,
        supply: token.token_supply,
        symbol: token.token_name,
      };
      let centralBankDetails: ICentralBankDetails = {
        smart_contract_address: contract_address,
        bank_user_address: bank_address,
        token_name: token.token_name,
        token_supply: token.token_supply,
        token_symbol: token.token_name.replace(" ", "_"),
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
      let transaction = await contract.createToken(
        data.name,
        data.symbol,
        data.supply,
        centralBankDetails
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
          transaction_action: "create_token",
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
        transaction_action: "create_token",
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

  async transfer(token: ITransferTokenFormData) {
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
      let transaction = await contract.transfer(
        token.bank_address,
        token.supply_to_be_sent
      );
      const transactionData = await transaction.wait();
      if (transactionData) {
        let baseTransaction: iTransaction = {
          transaction_hash: transactionData.blockHash,
          from_address: transactionData.from,
          to_address: token.bank_address,
          created_at: Timestamp.now(),
        };
        let extraDetails: iTransactionDetails = {
          doc_id: "",
          transaction_hash: transactionData.blockHash,
          from_address: transactionData.from,
          to_address: token.bank_address,
          transaction_tokens: [],
          transaction_action: "transfer_token",
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
        to_address: token.bank_address,
        created_at: Timestamp.now(),
      };
      let extraDetails: iTransactionDetails = {
        doc_id: "",
        transaction_hash: transactionData.blockHash,
        from_address: transactionData.from,
        to_address: token.bank_address,
        transaction_tokens: [],
        transaction_action: "transfer_token",
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

  async requestTokenTransfer({
    requesterAddress,
    tokens,
  }: {
    requesterAddress: string;
    tokens: number;
  }) {
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
      let transaction = await contract.requestTokens(requesterAddress, tokens);
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
          transaction_action: "request_token_transfer",
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
        transaction_action: "request_token_transfer",
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

  async approveTokenRequest({
    requesterAddress,
    contractAddress,
  }: {
    requesterAddress: string;
    contractAddress: string;
  }) {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(
        contractAddress,
        CBDCContract.abi,
        signer
      );
      let transaction = await contract.approveTokens(requesterAddress);
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
          transaction_action: "approve_token_transfer",
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
        transaction_action: "approve_token_transfer",
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

  async mintToken(value: number, country: string) {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(
        STABLE_COIN_CONTRACT_ADDRESS,
        StableContract.abi,
        signer
      );
      let transaction = await contract.mint(value, country);
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
          transaction_tokens: [value.toString()],
          transaction_action: "mint_token",
          transaction_block: transactionData.blockNumber,
          transaction_value: value,
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
        transaction_tokens: [value.toString()],
        transaction_action: "mint_token",
        transaction_block: transactionData.blockNumber,
        transaction_value: value,
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
      console.log(error);
      throw error;
    }
  }
}
export const tokenController = new TokenController();
