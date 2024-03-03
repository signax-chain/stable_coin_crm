require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ccx_team: {
      url: "https://eth-sepolia.g.alchemy.com/v2/QZN0dSFmJQ6xAM7yzbzpA76C2CbZFyQF",
      accounts: ["0x386af4b4c8d5e747f56eb4c6a3ccc095316d260dfaa2f9206bf2f5be235effea"],
    },
    cbdc_bank: {
      url: "https://eth-sepolia.g.alchemy.com/v2/QZN0dSFmJQ6xAM7yzbzpA76C2CbZFyQF",
      accounts: ["0x5eb833bab528c28ca667d28fb7f14eb1560c6549de17dea5a8ac7dee8ed80b53"],
    },
    avalanche: {
      url: "http://127.0.0.1:9650/ext/bc/2Rz19DPoS9g1D1F7qcS4fFei3rW8dDQiqBiPNPPyTGnMxzdeLL/rpc",
      accounts: ["0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"],
    }
  },
};
