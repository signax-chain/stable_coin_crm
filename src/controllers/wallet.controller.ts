import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import CBDCContract from "../artifacts/contracts/cbdccoin.sol/CBDCCoin.json";

class WalletController {
  async connectWallet() {
    try {
      let web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      var accounts = await web3.eth.getAccounts();
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      const result = {
        address: accounts[0],
        balance: web3.utils.fromWei(accountBalance , "ether"),
        isConnected: true,
      };
      return result;
    } catch (error) {
      console.log(error);
      const result = {
        address: undefined,
        balance: 0,
        isConnected: false,
      };
      return result;
    }
  }

  async deployContract(){
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const factory = new ethers.ContractFactory(CBDCContract.abi, CBDCContract.bytecode, signer);
      const contract = await factory.deploy();
      return contract.target.toString();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
export const walletController = new WalletController();
