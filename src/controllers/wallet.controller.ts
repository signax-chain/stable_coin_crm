import Web3 from "web3";

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
}
export const walletController = new WalletController();
