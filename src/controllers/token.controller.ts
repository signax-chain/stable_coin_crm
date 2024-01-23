import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CBDCContract from "../artifacts/contracts/cbdccoin.sol/CBDCCoin.json";
import { ITokenDetails } from "../models/ITokenDetail";
import { CONTRACT_ADDRESS, RPC_URL } from "../helpers/Constants";

class TokenController {
  async getAllToken() {
    try {
      const allToken = [];
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CBDCContract.abi,
        provider
      );
      const data = await contract.getAllToken();
      console.log(data);
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let d = {
          token_id: element.token_id,
          name: element.name,
          supply: Number(element.supply),
          symbol: element.name,
        };
        console.log(d);
        allToken.push(d);
      }
      return allToken;
    } catch (error) {
      throw error;
    }
  }

  async createToken(token: ITokenDetails) {
    try {
      let data = {
        name: token.token_name,
        supply: token.token_supply,
        symbol: token.token_name,
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
      let transaction = await contract.createToken(
        data.name,
        data.symbol,
        data.supply
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
