const hre = require("hardhat");

async function main() {
  const CBDCCoin = await hre.ethers.deployContract("CBDCCoin");
  await CBDCCoin.waitForDeployment();
  console.log("CBDCCoin deployed to:", CBDCCoin.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
