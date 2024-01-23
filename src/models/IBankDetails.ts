import { ReactNode } from "react";
import { ITokenDetails } from "./ITokenDetail";

export interface IBankDetails {
  token_id: number;
  bank_name: string;
  bank_address: string;
  bank_user_extension: string;
  daily_max_transaction_amount: number;
  daily_max_number_transaction: number;
}

export interface IBankDisplay {
  title: string;
  subtitle: string;
  icon: ReactNode;
  bank_details: IBankDetails;
}
