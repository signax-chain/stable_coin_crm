const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const CBDCCoin = await hre.ethers.deployContract("CBDCCoin");
  await CBDCCoin.waitForDeployment();
  console.log("CBDCCoin deployed to:", CBDCCoin.target);
  fs.writeFileSync(
    "./src/helpers/ContractAddress.ts",
    `export const CONTRACT_ADDRESS = "${CBDCCoin.target}";`,
    {flag: "a+"}
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
