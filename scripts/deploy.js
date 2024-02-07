const hre = require("hardhat");

async function main() {
  const CBDCCoin = await hre.ethers.deployContract("CBDCCoin");
  await CBDCCoin.waitForDeployment();
  console.log("CBDCCoin deployed to:", CBDCCoin.target);
  const StableCoin = await hre.ethers.deployContract("StableCoin");
  await StableCoin.waitForDeployment();
  console.log("StableCoin deployed to:", StableCoin.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
