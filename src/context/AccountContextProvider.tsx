import React from "react";

export type GlobalContextModel = {
  isLoggedIn: boolean;
  data: {
    address: string;
    balance: number;
  };
  changeLogInStatus: (c: boolean) => void;
  changeContent: (c: { address: string; balance: number }) => void;
};

const AccountContextProvider = React.createContext<GlobalContextModel>({
  isLoggedIn: false,
  data: {
    address: "",
    balance: 0,
  },
  changeLogInStatus: () => {},
  changeContent: () => {},
});
AccountContextProvider.displayName = "Account Context Provider";
export default AccountContextProvider;
