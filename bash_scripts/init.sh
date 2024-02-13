echo "Deploying all contract details"
echo "*****************************************"
echo "Deploying Central Bank Smart Contract (CBDC Contract)"
npx hardhat run scripts/central_bank_deploy.js --network cbdc_bank
echo "*****************************************"
echo "Deploying CCX Team Smart Contract (Stable Coin Contract)"
npx hardhat run scripts/ccx_team_deploy.js --network ccx_team