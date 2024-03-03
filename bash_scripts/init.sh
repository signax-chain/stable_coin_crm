echo "Deploying all contract details"
> src/helpers/ContractAddress.ts
echo "*****************************************"
echo "Deploying Central Bank Smart Contract (CBDC Contract)"
npx hardhat run scripts/central_bank_deploy.js --network cbdc_bank

exit_code=$?
if [ $exit_code -ne 0 ]; then
    echo "Error building application"
fi

echo "*****************************************"
echo "Deploying CCX Team Smart Contract (Stable Coin Contract)"
npx hardhat run scripts/ccx_team_deploy.js --network ccx_team