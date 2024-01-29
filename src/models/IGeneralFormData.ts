export interface ITransferTokenFormData {
  token_name: string;
  total_supply: number;
  bank_address: string;
  supply_to_be_sent: number;
}
export interface IUserBankRelation {
  user_address: string;
  bank_address: string;
  name: string;
  bank_id_extension: string;
  id: number | 0;
}
export interface IWalletData {
  isLoggedIn: boolean;
  data: {
    address: string;
    balance: number;
  };
}

export interface IInformationStats {
  title: string;
  content: string;
  footer: IInformationStats[],
}