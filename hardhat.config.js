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
    ethereum: {
      url: "https://eth-goerli.g.alchemy.com/v2/AIB9PePeQo8z07x0qtINpDSZUZuFJbKp",
      accounts: ["0x386af4b4c8d5e747f56eb4c6a3ccc095316d260dfaa2f9206bf2f5be235effea"],
    },
  },
};
