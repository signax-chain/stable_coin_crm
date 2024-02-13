const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const StableCoin = await hre.ethers.deployContract("StableCoin");
  await StableCoin.waitForDeployment();
  console.log("StableCoin deployed to:", StableCoin.target);
  fs.writeFileSync(
    "./src/helpers/ContractAddress.ts",
    `export const STABLE_COIN_CONTRACT_ADDRESS = "${StableCoin.target}";`,
    {flag: "a+"}
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
