import React from "react";

export type GlobalContextContract = {
  contract_address: string;
  changeContractAddress: (c: string) => void;
};

const ContractContextProvider = React.createContext<GlobalContextContract>({
  contract_address: "",
  changeContractAddress: () => {},
});
ContractContextProvider.displayName = "Contract Context Provider";
export default ContractContextProvider;
