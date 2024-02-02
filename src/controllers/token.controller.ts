import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CBDCContract from "../artifacts/contracts/cbdccoin.sol/CBDCCoin.json";
import { ITokenDetails } from "../models/ITokenDetail";
import { RPC_URL } from "../helpers/Constants";
import { ICentralBankDetails } from "../models/IBankDetails";
import { localStorageController } from "./storage.controller";
import { ITransferTokenFormData } from "../models/IGeneralFormData";

class TokenController {
  async getAllToken(address: string) {
    try {
      const contract_address = localStorageController.getData("contract_address");
      if(!contract_address){
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
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async transfer(token: ITransferTokenFormData) {
    try {
      const contract_address = localStorageController.getData("contract_address");
      if(!contract_address){
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
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

}
export const tokenController = new TokenController();
